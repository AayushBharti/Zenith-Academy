"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthLayout from "@/features/auth/components/auth-layout";
import { useSignUp } from "@/features/auth/hooks/use-auth-mutations";
import { useAuthStore } from "@/features/auth/use-auth-store";

const otpSchema = z.object({
  otp: z.string().min(6, "Your one-time password must be 6 characters."),
});

export default function VerifyEmail() {
  const router = useRouter();
  const { signupData } = useAuthStore();
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const signUpMutation = useSignUp();

  useEffect(() => {
    if (!signupData) {
      router.push("/signup");
    }
  }, [signupData, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  function onSubmit(data: z.infer<typeof otpSchema>) {
    setError(null);
    if (!signupData) {
      setError("Signup data is not available");
      return;
    }

    const { email, accountType, firstName, lastName, password, confirmPassword } =
      signupData;
    signUpMutation.mutate(
      { accountType, firstName, lastName, email, password, confirmPassword: confirmPassword ?? password, otp: data.otp },
      {
        onSuccess: () => router.push("/login"),
        onError: () => setError("Invalid OTP. Please try again."),
      }
    );
  }

  const handleResendOTP = () => {
    setCountdown(30);
  };

  if (!signupData) return null;

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl tracking-tight">
            Verify your email
          </h1>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">
              {signupData.email}
            </span>
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Enter the code sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <Button
              className="w-full"
              disabled={signUpMutation.isPending}
              type="submit"
            >
              {signUpMutation.isPending ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-muted-foreground text-sm">
          Didn&apos;t receive the code?{" "}
          {countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <button
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              onClick={handleResendOTP}
              type="button"
            >
              Resend OTP
            </button>
          )}
        </p>

        <Button
          className="w-full"
          onClick={() => router.push("/signup")}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign Up
        </Button>
      </div>
    </AuthLayout>
  );
}
