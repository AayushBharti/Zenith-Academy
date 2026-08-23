"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
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
import { Input } from "@workspace/ui/components/input";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthLayout from "@/features/auth/components/auth-layout";
import { useGetPasswordResetToken } from "@/features/auth/hooks/use-auth-mutations";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetTokenMutation = useGetPasswordResetToken();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    setError(null);
    resetTokenMutation.mutate(data.email, {
      onSuccess: () => setIsSubmitted(true),
      onError: () =>
        setError(
          "An error occurred while processing your request. Please try again."
        ),
    });
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl tracking-tight">
            {isSubmitted ? "Check your email" : "Reset your password"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSubmitted
              ? `If an account exists for ${form.getValues().email}, you will receive a password reset email shortly.`
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {isSubmitted ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Email sent</AlertTitle>
            <AlertDescription>
              Check your inbox for the password reset link.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We&apos;ll send a password reset link to this email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                disabled={resetTokenMutation.isPending}
                type="submit"
              >
                {resetTokenMutation.isPending
                  ? "Sending..."
                  : "Reset Password"}
              </Button>
            </form>
          </Form>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              href="/signup"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
