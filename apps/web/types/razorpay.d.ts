// apps/web/types/razorpay.d.ts

interface RazorpayOptions {
  key: string | undefined;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  handler: (response: any) => void;
  theme: {
    color: string;
  };
}

// Extend the global Window interface to include the Razorpay constructor
declare global {
  interface Window {
    Razorpay: new (
      options: RazorpayOptions
    ) => {
      open(): void;
      on(event: string, callback: (...args: any[]) => void): void;
    };
  }
}

// This empty export is needed to treat the file as a module
export {};
