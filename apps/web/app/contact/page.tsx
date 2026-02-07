import {
  Clock,
  Mail,
  MapPin,
  MessageCircleQuestion,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/contact-us/contact-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact Us | ZenithAcademy",
  description:
    "Get in touch with our team for support, inquiries, or feedback.",
};

export default function ContactPage() {
  return (
    <div className="mt-16 min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-5 text-center">
          <h1 className="font-bold text-4xl text-foreground tracking-tight md:text-5xl">
            Contact Our Team
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have questions about our courses or need technical support?
            We&apos;re here to help you on your learning journey.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Contact Information */}
          <div className="flex flex-col gap-10 lg:col-span-5">
            <div>
              <h2 className="mb-6 font-semibold text-2xl">
                Contact Information
              </h2>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email Us</h3>
                    <p className="mb-1 text-muted-foreground text-sm">
                      For general inquiries and support.
                    </p>
                    <a
                      className="font-semibold text-primary hover:underline"
                      href="mailto:hello@aayushbharti.in"
                    >
                      hello@aayushbharti.in
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Call Us</h3>
                    <p className="mb-1 text-muted-foreground text-sm">
                      Mon-Fri from 9am to 6pm.
                    </p>
                    <a
                      className="font-semibold text-primary hover:underline"
                      href="tel:+15551234567"
                    >
                      +1 (xxx) xxx-xxxx
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Visit Us</h3>
                    <p className="mb-1 text-muted-foreground text-sm">
                      Come say hello at our office.
                    </p>
                    <address className="text-foreground not-italic">
                      123 Education Lane,
                      <br />
                      Learning City, ED 12345
                    </address>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Office Hours */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-xl">Office Hours</h2>
              </div>
              <div className="ml-8 space-y-2 text-muted-foreground text-sm">
                <div className="flex max-w-xs justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-foreground">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex max-w-xs justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-foreground">
                    10:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex max-w-xs justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-foreground">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="rounded-xl border border-muted bg-muted/50 p-6">
              <div className="flex items-start gap-4">
                <MessageCircleQuestion className="mt-1 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Have a quick question?
                  </h3>
                  <p className="mt-1 mb-3 text-muted-foreground text-sm">
                    Check out our Frequently Asked Questions to find answers
                    instantly.
                  </p>
                  <Button
                    className="h-auto px-0 font-semibold text-primary"
                    variant="link"
                  >
                    Visit FAQ Center &rarr;
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          {/* Note: We removed the wrapping Card here because ContactForm has its own Card */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
