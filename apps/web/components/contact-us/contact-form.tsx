"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
// Make sure your JSON file is standard array of objects: { code: "+91", country: "India" }
import countryCode from "@/data/countrycode.json" with { type: "json" };
import { cn } from "@/lib/utils";
import { apiConnector } from "@/utils/api-connector";
import { contactusEndpoint } from "@/utils/apis";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().min(1, "Required"),
  phoneNo: z
    .string()
    .min(8, "Invalid phone number")
    .max(12, "Invalid phone number")
    .regex(/^\d+$/, "Must be numbers only"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91", // Default to India or common user base
      phoneNo: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const phoneNo = `${values.countryCode} ${values.phoneNo}`;
      const { firstName, lastName, email, message } = values;

      const res = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, {
        firstName,
        lastName,
        email,
        message,
        phoneNo,
      });

      if (res.data.success) {
        form.reset();
        toast.success("Message sent successfully", {
          description: "We'll get back to you shortly.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl p-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-muted/40 shadow-lg">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="font-bold text-3xl tracking-tight">
            Get in touch
          </CardTitle>
          <CardDescription className="text-lg">
            We&apos;d love to hear from you. Fill out the form below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Name Row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className="bg-background"
                        />
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
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        type="email"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number with Combobox */}
              <div className="grid gap-2">
                <FormLabel>Phone Number</FormLabel>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover
                          onOpenChange={setOpenCountry}
                          open={openCountry}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                aria-expanded={openCountry}
                                className={cn(
                                  "w-[120px] justify-between bg-background",
                                  !field.value && "text-muted-foreground"
                                )}
                                role="combobox"
                                variant="outline"
                              >
                                {field.value
                                  ? countryCode.find(
                                      (item) => item.code === field.value
                                    )?.code
                                  : "+91"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[280px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {countryCode.map((item) => (
                                    <CommandItem
                                      key={`${item.code}-${item.country}`}
                                      onSelect={() => {
                                        form.setValue("countryCode", item.code);
                                        setOpenCountry(false);
                                      }} // Search by name or code
                                      value={`${item.country} ${item.code}`}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          item.code === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <span className="flex-1 truncate">
                                        {item.country}
                                      </span>
                                      <span className="text-muted-foreground text-xs">
                                        {item.code}
                                      </span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNo"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            className="bg-background"
                            placeholder="123 456 7890"
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px] resize-none bg-background"
                        placeholder="Tell us about your project or inquiry..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                className="w-full shadow-sm md:w-auto md:min-w-[150px]"
                disabled={loading}
                size="lg"
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
