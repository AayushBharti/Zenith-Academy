import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { SectionHeader } from "../../shared/components/section-header";

const FAQData = [
  {
    question: "What makes Nextdemy different from Udemy or Coursera?",
    answer:
      "Nextdemy is built around cohort-based learning, not self-paced video libraries. Every course includes peer code reviews, group deadlines, and live instructor office hours. You learn with people, not just from recordings.",
  },
  {
    question: "How do cohorts work?",
    answer:
      "When you enroll, you join a group of 20-30 learners on the same path. You follow a shared timeline with weekly milestones, submit projects for peer review, and participate in group discussions. It's structured accountability that keeps you on track.",
  },
  {
    question: "Is it free?",
    answer:
      "Free learning paths are always available. Premium cohorts with live instructor access, peer reviews, and verified credentials are paid. No hidden fees, no surprise charges.",
  },
  {
    question: "Are the credentials recognized?",
    answer:
      "Nextdemy credentials are backed by your project portfolio and peer-validated code reviews — not just a quiz score. Employers value demonstrated skill, and our learners carry proof of real work.",
  },
  {
    question: "Can I interact with instructors?",
    answer:
      "Yes — every cohort includes weekly live office hours with the course instructor. Ask questions, debug together, and go deeper than any forum thread allows. It's not a chatbot — it's a real person who built what they teach.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-linear-to-b from-background/80 to-background py-20 sm:py-32">
      <div className="container">
        <SectionHeader
          badge="Common Questions"
          title="Frequently Asked Questions"
        />
        <div className="mx-auto mt-16 max-w-3xl">
          <Accordion className="w-full" collapsible type="single">
            {FAQData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
