import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Badge } from "../ui/badge"

const FAQData = [
  {
    question: "What makes ZenithMinds unique?",
    answer:
      "ZenithMinds combines cutting-edge AI technology with expert-led courses to provide a personalized, adaptive learning experience. Our platform adjusts to each learner&apos;s pace and style, ensuring optimal knowledge retention and skill development.",
  },
  {
    question: "How does the subscription model work?",
    answer:
      "We offer flexible subscription plans that give you access to our entire course library. Choose from monthly or annual plans, with the option to upgrade or downgrade at any time. All subscriptions include personalized learning paths, progress tracking, and certificates upon course completion.",
  },
  {
    question: "Are the courses accredited?",
    answer:
      "Many of our courses are accredited by leading educational institutions and industry bodies. We partner with universities and organizations to ensure our content meets high academic standards and provides real-world value. Check individual course descriptions for specific accreditation details.",
  },
  {
    question: "Can I interact with instructors and other learners?",
    answer:
      "ZenithMinds fosters a vibrant learning community. Engage with instructors through live Q&A sessions, participate in discussion forums, and collaborate with peers on projects. Our social learning features enhance your educational experience and help build valuable connections.",
  },
  {
    question: "How often is course content updated?",
    answer:
      "We&apos;re committed to keeping our content current and relevant. Our team of experts regularly reviews and updates courses to reflect the latest industry trends, technological advancements, and best practices. Most courses are refreshed at least annually, with some high-paced subjects updated even more frequently.",
  },
]

export default function FAQ() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-background/80 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <Badge variant="outline" className="mb-6">
            Get to Know Us Better
          </Badge>
        </div>
        <div className="mt-16 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
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
  )
}
