# Payment Model & Schema Improvements Design

**Date:** 2026-02-15
**Author:** Claude Code
**Status:** Approved
**Approach:** Conservative updates - Payment model + critical fixes

---

## Overview

Add Payment model to track transaction history and apply conservative improvements to existing models for consistency, validation, and performance.

---

## Current State

**Payment Flow:**
- `capturePayment`: Creates Razorpay order
- `verifySignature`: Verifies payment signature, enrolls student
- `sendPaymentSuccessEmail`: Sends confirmation email

**Problem:** No payment data persistence - can't track transaction history, payment failures, or refunds.

**Existing Models:**
- User, Course, CourseProgress, Profile, RatingAndReview, Category, Section, SubSection, OTP

**Issues Identified:**
1. No payment audit trail
2. Missing timestamps (CourseProgress, Profile)
3. Inconsistent naming (`userID` vs `user`)
4. Weak validation (optional fields that should be required)
5. Missing performance indexes

---

## Design Decisions

### Approach Selected: Payment Model + Critical Fixes

**Scope:**
- Add Payment model with basic transaction tracking
- Standardize naming conventions
- Add timestamps to models missing them
- Add indexes for common queries
- Strengthen validation on core fields
- Use shared-types package for request/response validation

**Rationale:**
- Balances improvement with pragmatism
- Fixes critical issues without over-engineering
- Low risk to existing code
- Provides clean foundation
- Shared types ensure consistency across API and web

**Rejected Alternatives:**
- Minimal (leaves inconsistencies)
- Comprehensive refactor (violates YAGNI, high risk)

---

## Shared Types Integration

**Package:** `packages/shared-types`

The API now uses centralized Zod schemas from the shared-types package for validation. This ensures:
- Type safety between frontend and backend
- Single source of truth for validation rules
- Reduced duplication
- Consistent error messages

**Payment-related schemas** (`packages/shared-types/src/payment.ts`):
- `capturePaymentSchema` - validates payment capture requests
- `verifySignatureSchema` - validates signature verification
- `sendPaymentSuccessEmailSchema` - validates email payload
- `capturePaymentResponseSchema` - validates payment response

**New schemas to add:**
- `paymentHistoryResponseSchema` - validates payment history response
- `instructorEarningsResponseSchema` - validates earnings response
- `paymentRecordSchema` - validates individual payment record

**Usage in API:**
```typescript
import {
  capturePaymentSchema,
  verifySignatureSchema,
  type CapturePaymentInput,
  type VerifySignatureInput,
  type CapturePaymentResponse
} from "@repo/shared-types";

// In controller
const data = capturePaymentSchema.parse(req.body);
```

**Package dependency:**
- API `package.json` includes: `"@repo/shared-types": "workspace:*"`
- Import path: `@repo/shared-types` (Turborepo workspace alias)

---

## Payment Model Schema

**Location:** `apps/api/src/modules/payment/models/payment.model.ts`

```typescript
{
  razorpay_order_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  razorpay_payment_id: {
    type: String,
    index: true
    // Null until payment completes
  },
  razorpay_signature: {
    type: String
    // Null until verified, stored for audit trail
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  }],

  amount: {
    type: Number,
    required: true
    // Stored in paise (Razorpay format)
  },
  currency: {
    type: String,
    required: true,
    default: "INR"
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    required: true,
    default: "pending",
    index: true
  },

  failureReason: {
    type: String
    // Optional, populated on payment failure
  }
},
{ timestamps: true }
```

**Key Decisions:**

1. **Unique order ID:** Prevents duplicate payment records
2. **Indexed fields:** Optimizes queries for payment history, failed payments, user lookups
3. **Status enum:** Enables payment lifecycle tracking (pending → success/failed/refunded)
4. **Amount in paise:** Matches Razorpay convention (avoid decimal precision issues)
5. **Signature stored:** Audit trail, but not indexed (rarely queried)
6. **Timestamps:** Auto-tracks creation and updates

---

## Model Updates

### CourseProgress (`apps/api/src/modules/course/models/course-progress-model.ts`)

**Changes:**
- Rename: `userID` → `user`
- Rename: `courseID` → `course`
- Make required: `user`, `course`
- Add: `timestamps: true`

**Rationale:** Consistency with other models, proper validation, audit trail.

**Shared Types Update:**
- Update `courseProgressSchema` in `packages/shared-types/src/course.ts`
- Change `courseID: z.string()` → `course: z.string()`
- Ensures frontend/backend consistency

### Profile (`apps/api/src/modules/profile/models/profile.model.ts`)

**Changes:**
- Add: `timestamps: true`

**Rationale:** Track when profile created/updated. Fields remain optional (gradual completion).

### Course (`apps/api/src/modules/course/models/course-model.ts`)

**Changes:**
- Make required: `courseName`, `courseDescription`, `price`
- Add validation: `price >= 0`

**Rationale:** Core course data should be mandatory. Negative prices invalid.

### User Model

**Changes:** None (already has timestamps, proper validation)

---

## Indexes

Add indexes for query performance:

| Model | Field(s) | Purpose |
|-------|----------|---------|
| User | `email` (unique) | Login lookups (formalize existing) |
| Course | `instructor`, `status` | Instructor dashboard, published courses |
| Payment | `user`, `status`, `razorpay_order_id` | Payment history, failed payments, order lookup |
| RatingAndReview | `course` | Course ratings (verify existing index) |

**Query Optimization:**
- Payment history: `Payment.find({ user: userId })`
- Failed payments: `Payment.find({ status: "failed" })`
- Instructor earnings: `Payment.find({ courses: { $in: instructorCourses }, status: "success" })`
- Order verification: `Payment.findOne({ razorpay_order_id: orderId })`

---

## Service Layer Updates

**File:** `apps/api/src/modules/payment/services/payment.service.ts`

**Imports:**
```typescript
import {
  type CapturePaymentInput,
  type VerifySignatureInput,
  type CapturePaymentResponse
} from "@repo/shared-types";
import { Payment } from "../models/payment.model";
import { razorpay } from "@/configs/razorpay";
```

### Modified Functions

#### `capturePayment(userId: string, data: CapturePaymentInput): Promise<CapturePaymentResponse>`

**Current:** Creates Razorpay order
**Updated:** Creates Razorpay order + saves Payment record with status "pending"

```typescript
const paymentResponse = await razorpay.orders.create(options);

// NEW: Save payment record
const payment = new Payment({
  razorpay_order_id: paymentResponse.id,
  user: userId,
  courses: data.courses,
  amount: paymentResponse.amount,
  currency: paymentResponse.currency,
  status: "pending"
});
await payment.save();

return {
  orderId: paymentResponse.id,
  currency: paymentResponse.currency,
  amount: paymentResponse.amount
};
```

#### `verifySignature(userId: string, data: VerifySignatureInput): Promise<void>`

**Current:** Verifies signature, enrolls student
**Updated:** Verifies signature, updates Payment to "success", enrolls student

```typescript
const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = data;

// Verify signature (existing logic)
const generatedSignature = crypto
  .createHmac("sha256", env.RAZORPAY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest("hex");

if (generatedSignature !== razorpay_signature) {
  // NEW: Mark payment as failed
  await Payment.findOneAndUpdate(
    { razorpay_order_id },
    {
      status: "failed",
      failureReason: "Invalid signature"
    }
  );
  throw ApiError.unauthorized("Invalid payment signature");
}

// NEW: Update payment record
await Payment.findOneAndUpdate(
  { razorpay_order_id },
  {
    razorpay_payment_id,
    razorpay_signature,
    status: "success"
  }
);

// Enroll student (existing logic)
await enrollStudent(courses, userId);
```

---

## Controller Layer Updates

**File:** `apps/api/src/modules/payment/controllers/payment.controller.ts`

Controllers validate requests using shared schemas before calling services:

```typescript
import {
  capturePaymentSchema,
  verifySignatureSchema,
  sendPaymentSuccessEmailSchema
} from "@repo/shared-types";
import * as PaymentService from "../services/payment.service";
import { asyncHandler } from "@/shared/utils/async-handler";
import { ApiResponse } from "@/shared/utils/api-response";

export const capturePayment = asyncHandler(async (req, res) => {
  // Validate request with shared schema
  const data = capturePaymentSchema.parse(req.body);
  const userId = req.user.id;

  // Call service with typed data
  const result = await PaymentService.capturePayment(userId, data);

  return ApiResponse.ok(res, "Payment initiated successfully", result);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  // Validate request with shared schema
  const data = verifySignatureSchema.parse(req.body);
  const userId = req.user.id;

  // Call service with typed data
  await PaymentService.verifySignature(userId, data);

  return ApiResponse.ok(res, "Payment verified and enrollment successful");
});
```

**Benefits:**
- Automatic type inference from Zod schemas
- Consistent validation between API and Web
- Runtime safety + compile-time type checking
- Single source of truth for request shapes

---

### New Service Functions

**Note:** These functions require new response schemas in `packages/shared-types/src/payment.ts`:

```typescript
// Add to packages/shared-types/src/payment.ts
export const paymentRecordSchema = z.object({
  _id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["pending", "success", "failed", "refunded"]),
  courses: z.array(z.object({
    _id: z.string(),
    courseName: z.string(),
    thumbnail: z.string(),
    price: z.number()
  })),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type PaymentRecord = z.infer<typeof paymentRecordSchema>;

export const paymentHistoryResponseSchema = z.object({
  payments: z.array(paymentRecordSchema),
  total: z.number()
});
export type PaymentHistoryResponse = z.infer<typeof paymentHistoryResponseSchema>;

export const instructorEarningsResponseSchema = z.object({
  totalEarnings: z.number(),
  totalTransactions: z.number(),
  currency: z.string()
});
export type InstructorEarningsResponse = z.infer<typeof instructorEarningsResponseSchema>;
```

#### `getPaymentHistory(userId: string, options?: { status?: string; limit?: number }): Promise<PaymentRecord[]>`

Retrieve user's payment records with optional filtering.

```typescript
import { type PaymentRecord } from "@repo/shared-types";

export const getPaymentHistory = async (
  userId: string,
  options?: { status?: string; limit?: number }
): Promise<PaymentRecord[]> => {
  const query: any = { user: userId };
  if (options?.status) {
    query.status = options.status;
  }

  return Payment.find(query)
    .populate("courses", "courseName thumbnail price")
    .sort({ createdAt: -1 })
    .limit(options?.limit || 50)
    .lean();
};
```

#### `getInstructorEarnings(instructorId: string): Promise<InstructorEarningsResponse>`

Aggregate successful payments for instructor's courses.

```typescript
import { type InstructorEarningsResponse } from "@repo/shared-types";

export const getInstructorEarnings = async (
  instructorId: string
): Promise<InstructorEarningsResponse> => {
  const instructorCourses = await Course.find(
    { instructor: instructorId },
    "_id"
  );
  const courseIds = instructorCourses.map(c => c._id);

  const payments = await Payment.find({
    courses: { $in: courseIds },
    status: "success"
  });

  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = payments.length;

  return {
    totalEarnings: totalEarnings / 100, // Convert paise to rupees
    totalTransactions,
    currency: "INR"
  };
};
```

---

## Data Flow

### Payment Creation Flow

```
1. User initiates payment (capturePayment)
   ↓
2. Create Razorpay order
   ↓
3. Save Payment record (status: "pending")
   ↓
4. Return order details to frontend
   ↓
5. User completes payment on Razorpay
   ↓
6. Frontend calls verifySignature
   ↓
7. Verify signature
   ↓
8a. Success: Update Payment (status: "success") → Enroll student
8b. Failure: Update Payment (status: "failed", reason)
```

### Error Handling

**Payment creation fails:**
- Razorpay order creation error → throw ApiError, no Payment record created

**Signature verification fails:**
- Update Payment status to "failed" with reason
- Throw ApiError (student not enrolled)

**Enrollment fails after successful payment:**
- Payment marked "success" but enrollment incomplete
- Manual intervention required (admin dashboard future enhancement)

---

## Migration Considerations

### Data Migration

**Not required** - this is additive:
- Payment model is new, no existing data to migrate
- Field renames (`userID` → `user`) are Mongoose schema changes, not DB column renames
- Timestamps auto-populate on next document save
- Indexes created by Mongoose on app startup

### Backward Compatibility

**Pre-existing payments:** No historical payment records (acceptable - new feature)
**Existing enrollments:** All remain valid, unaffected
**Code updates required:** Update references to `userID`/`courseID` in CourseProgress queries

### Deployment Steps

1. Deploy model changes (Payment model, updated schemas)
2. Restart API server (Mongoose creates indexes)
3. Verify indexes created: `db.payments.getIndexes()`
4. Monitor payment flow in production
5. Update frontend to display payment history (future enhancement)

---

## Testing Strategy

### Unit Tests (Future)

- Payment model validation (required fields, enums, defaults)
- Service functions (capturePayment, verifySignature, getPaymentHistory)
- Index queries (verify performance)

### Integration Tests (Future)

- Full payment flow (create → verify → enroll)
- Signature verification failure scenarios
- Payment history retrieval
- Instructor earnings calculation

### Manual Testing (Immediate)

1. Create payment → verify "pending" record saved
2. Complete payment → verify status updated to "success", student enrolled
3. Invalid signature → verify status "failed", reason populated
4. Query payment history → verify correct records returned
5. Check indexes created → `db.payments.getIndexes()`

---

## Future Enhancements (Out of Scope)

- Admin dashboard: view all payments, filter by status, export reports
- Refund processing: admin-initiated refunds with reason tracking
- Payment analytics: revenue charts, conversion rates, failed payment insights
- Multi-currency support: beyond INR
- Webhook handling: Razorpay webhooks for async payment updates
- Partial refunds: track refund amount separately
- Payment disputes: track chargebacks, dispute resolution

---

## File Checklist

**New Files:**
- `apps/api/src/modules/payment/models/payment.model.ts`

**Modified Files:**
- `apps/api/src/modules/payment/controllers/payment.controller.ts` (use shared schemas)
- `apps/api/src/modules/payment/services/payment.service.ts` (use shared types, add payment persistence)
- `apps/api/src/modules/course/models/course-progress-model.ts` (rename fields, add timestamps)
- `apps/api/src/modules/profile/models/profile.model.ts` (add timestamps)
- `apps/api/src/modules/course/models/course-model.ts` (strengthen validation)
- Any files querying CourseProgress (update `userID`/`courseID` refs)

**Dependencies:**
- Ensure `apps/api/package.json` includes: `"@repo/shared-types": "workspace:*"`
- Run `bun install` to link workspace package

**Shared Types Modified:**
- `packages/shared-types/src/payment.ts` - add new response schemas (paymentRecord, paymentHistory, instructorEarnings)
- `packages/shared-types/src/course.ts` - update courseProgressSchema (`courseID` → `course`)

**Shared Types Used:**
- `@repo/shared-types` - payment schemas (capturePayment, verifySignature, responses)
- `@repo/shared-types` - course schemas (courseProgress)

---

## Timeline Estimate

- Shared types creation (payment response schemas): 20 min
- Payment model creation: 30 min
- Model updates (CourseProgress, Profile, Course): 30 min
- Controller updates (use shared schemas): 20 min
- Service layer updates (use shared types, add persistence): 1 hour
- Index verification: 15 min
- Code updates (CourseProgress refs): 30 min
- Manual testing: 45 min

**Total:** 3.5-4.5 hours

---

## Success Criteria

✅ Shared payment response schemas created in `@repo/shared-types`
✅ Payment model created with all specified fields
✅ Controllers use shared schemas for validation
✅ Services use shared types for type safety
✅ Payment records saved on capturePayment
✅ Payment status updated on verifySignature
✅ Failed payments tracked with reasons
✅ Timestamps added to CourseProgress, Profile
✅ CourseProgress uses `user`/`course` (not `userID`/`courseID`)
✅ Course validation strengthened (required fields)
✅ Indexes created and verified
✅ Payment history queryable with proper types
✅ Instructor earnings calculable with proper types
✅ No breaking changes to existing functionality
✅ Type safety maintained across API and Web
