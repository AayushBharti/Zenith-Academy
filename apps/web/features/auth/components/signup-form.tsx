"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ACCOUNT_TYPE } from "@/data/constants";
import { useSendOtp } from "@/features/auth/hooks/use-auth-mutations";
import { useAuthStore } from "@/features/auth/use-auth-store";

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    accountType: z.enum([ACCOUNT_TYPE.STUDENT, ACCOUNT_TYPE.INSTRUCTOR]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const router = useRouter();
  const { setSignupData } = useAuthStore();
  const sendOtpMutation = useSendOtp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: ACCOUNT_TYPE.STUDENT,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSignupData(values);
    sendOtpMutation.mutate(values.email, {
      onSuccess: () => {
        router.push("/verify-email");
        form.reset();
      },
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs
          defaultValue={ACCOUNT_TYPE.STUDENT}
          onValueChange={(value) =>
            form.setValue(
              "accountType",
              value as
                | typeof ACCOUNT_TYPE.STUDENT
                | typeof ACCOUNT_TYPE.INSTRUCTOR
            )
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={ACCOUNT_TYPE.STUDENT}>Student</TabsTrigger>
            <TabsTrigger value={ACCOUNT_TYPE.INSTRUCTOR}>
              Instructor
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="6+ characters" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Re-enter password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="w-full"
          disabled={sendOtpMutation.isPending}
          type="submit"
        >
          {sendOtpMutation.isPending ? "Sending OTP..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
