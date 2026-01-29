"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HighlightText from "./highlighted-text";

type CTAButton = {
  active: boolean;
  linkto: string;
  btnText: React.ReactNode;
};

type CodeBlocksProps = {
  position: "flex-row" | "flex-row-reverse";
  heading: React.ReactNode;
  subheading: React.ReactNode;
  ctabtn1: CTAButton;
  ctabtn2: CTAButton;
  codeblock: string;
  backgroundGradient?: string;
};

export function CodeBlocks({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient = "from-blue-500/20 via-purple-500/20 to-pink-500/20",
}: CodeBlocksProps) {
  const [displayedCode, setDisplayedCode] = useState("");

  // --- Typing Logic ---
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    const typingSpeed = 20; // ms per character (Adjust for speed)
    const resetDelay = 3000; // ms to wait before restarting

    const typeCharacter = () => {
      if (currentIndex < codeblock.length) {
        setDisplayedCode(codeblock.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeCharacter, typingSpeed);
      } else {
        // Finished typing, wait then reset
        timeout = setTimeout(() => {
          setDisplayedCode("");
          currentIndex = 0;
          typeCharacter();
        }, resetDelay);
      }
    };

    typeCharacter();

    return () => clearTimeout(timeout);
  }, [codeblock]);

  // Calculate current line count based on displayed code to sync line numbers
  const lineCount = displayedCode.split("\n").length;

  return (
    <section className="container px-5 py-24">
      <div
        className={cn(
          "flex flex-col items-center gap-12 lg:gap-20",
          position === "flex-row" ? "lg:flex-row" : "lg:flex-row-reverse"
        )}
      >
        {/* --- Text Section --- */}
        <motion.div
          className="flex flex-col gap-6 lg:w-[45%]"
          initial={{ opacity: 0, x: position === "flex-row" ? -50 : 50 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="font-bold text-3xl text-neutral-900 leading-[1.15] tracking-tight sm:text-4xl md:text-5xl dark:text-neutral-50">
            {heading}
          </h2>
          <div className="text-lg text-neutral-600 leading-relaxed dark:text-neutral-400">
            {subheading}
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <Button
              asChild
              className={cn(
                "font-semibold shadow-lg transition-all hover:scale-105 active:scale-95",
                ctabtn1.active && "shadow-primary/25"
              )}
              size="lg"
              variant={ctabtn1.active ? "default" : "outline"}
            >
              <Link href={ctabtn1.linkto}>
                {ctabtn1.btnText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              className="font-semibold transition-all hover:scale-105 active:scale-95"
              size="lg"
              variant={ctabtn2.active ? "default" : "secondary"}
            >
              <Link href={ctabtn2.linkto}>{ctabtn2.btnText}</Link>
            </Button>
          </div>
        </motion.div>

        {/* --- Code Section --- */}
        <motion.div
          className="relative w-full lg:w-[50%]"
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          {/* Background Glow Effect */}
          <div
            className={cn(
              "-inset-4 absolute animate-pulse rounded-full opacity-40 blur-3xl",
              backgroundGradient
            )}
          />

          {/* The Code Window */}
          <div className="relative rounded-xl border border-neutral-200 bg-black/10 shadow-2xl backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-900/75">
            {/* Window Controls */}
            <div className="flex items-center justify-between border-white/10 border-b px-4 py-3">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="font-medium font-mono text-neutral-400 text-xs">
                main.tsx
              </div>
            </div>

            {/* Code Content */}
            <div className="relative flex h-[300px] overflow-auto p-4 font-mono text-sm leading-6">
              {/* Line Numbers */}
              <div className="flex select-none flex-col border-white/5 border-r pr-4 text-right text-neutral-600 transition-all duration-300">
                {Array.from({ length: Math.max(12, lineCount) }).map((_, i) => (
                  <span className="leading-6" key={i}>
                    {i + 1}
                  </span>
                ))}
              </div>

              {/* Dynamic Code Block */}
              <div className="flex-1 pl-4">
                <Highlight
                  code={displayedCode}
                  language="tsx"
                  theme={themes.nightOwl}
                >
                  {({ tokens, getLineProps, getTokenProps }) => (
                    <div className="whitespace-pre-wrap break-words">
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span
                              key={key}
                              {...getTokenProps({ token, key })}
                            />
                          ))}
                        </div>
                      ))}
                      {/* Blinking Cursor */}
                      <span className="inline-block h-4 w-1.5 animate-caret-blink bg-blue-400 align-middle" />
                    </div>
                  )}
                </Highlight>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export const CodeBlocksSection = () => (
  <div className="flex flex-col gap-20">
    <CodeBlocks
      backgroundGradient="from-cyan-500/20 via-purple-500/20 to-blue-500/20"
      codeblock={`const express = require('express');
const app = express();

app.use(express.json());

app.post('/submit', async (req, res) => { 
try {
// Simulating database operation
const result = await processRequest(req.body);
res.status(200).json({ 
  success: true, 
  data: result 
});
} catch (error) {
res.status(500).send('Server Error');
}
});

app.listen(3000, () => {
console.log('Server running on port 3000');
});`}
      ctabtn1={{
        btnText: "Try it yourself",
        linkto: "/signup",
        active: true,
      }}
      ctabtn2={{
        btnText: "Learn more",
        linkto: "/login",
        active: false,
      }}
      heading={
        <>
          Unlock Your <HighlightText text="coding potential" /> with our
          expertly crafted courses
        </>
      }
      position="flex-row"
      subheading="Learn from top industry professionals with years of coding experience, committed to helping you master the skills you need."
    />

    <CodeBlocks
      backgroundGradient="from-orange-500/20 via-pink-500/20 to-red-500/20"
      codeblock={`import { Controller, Post, Body } from '@nestjs/common';

@Controller('submit')
export class SubmitController {

@Post()
async submit(@Body() data: any): Promise<string> {
try {
  await this.service.process(data);
  return 'Request processed successfully';
} catch (error) {
  throw new HttpException(
    'Processing failed', 
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}
}
}`}
      ctabtn1={{
        btnText: "Continue Lesson",
        linkto: "/signup",
        active: true,
      }}
      ctabtn2={{
        btnText: "Learn more",
        linkto: "/login",
        active: false,
      }}
      heading={
        <>
          Start <HighlightText text="coding in seconds" />
        </>
      }
      position="flex-row-reverse"
      subheading="Jump right in and start coding from your very first lesson with our immersive hands-on environment."
    />
  </div>
);
