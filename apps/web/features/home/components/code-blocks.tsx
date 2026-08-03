"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
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

  // Calculate total line count from the full code block to show all line numbers at once
  const lineCount = codeblock.split("\n").length;

  return (
    <section className="container py-24">
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
              animation="swap"
              asChild
              variant={ctabtn1.active ? "default" : "outline"}
            >
              <Link href={ctabtn1.linkto}>{ctabtn1.btnText}</Link>
            </Button>

            <Button
              animation="slide-in"
              asChild
              className="font-semibold"
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
            <div className="relative flex h-[350px] overflow-hidden p-4 font-mono text-sm leading-6">
              {/* Line Numbers */}
              <div className="flex select-none flex-col pr-4 text-right text-neutral-600 transition-all duration-300">
                {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
                  <span className="leading-6" key={i}>
                    {i + 1}
                  </span>
                ))}
              </div>

              {/* Dynamic Code Block */}
              <div className="flex-1">
                <Highlight
                  code={displayedCode}
                  language="tsx"
                  theme={themes.nightOwl}
                >
                  {({ tokens, getLineProps, getTokenProps }) => (
                    <div className="select-text overflow-hidden whitespace-pre">
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, idx) => {
                            const { key: _k, ...tokenProps } = getTokenProps({
                              token,
                              key: idx,
                            });
                            return <span key={idx} {...tokenProps} />;
                          })}
                        </div>
                      ))}

                      {/* Cursor */}
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
        btnText: "Start Building",
        linkto: "/signup",
        active: true,
      }}
      ctabtn2={{
        btnText: "See Curriculum",
        linkto: "/catalog",
        active: false,
      }}
      heading={
        <>
          Write <HighlightText text="Real Code" /> From Day One
        </>
      }
      position="flex-row"
      subheading="No toy examples. Build production patterns used by engineering teams — then get feedback from peers who've shipped the same code."
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
        btnText: "Start Building",
        linkto: "/signup",
        active: true,
      }}
      ctabtn2={{
        btnText: "See Curriculum",
        linkto: "/catalog",
        active: false,
      }}
      heading={
        <>
          Ship Faster With <HighlightText text="Peer Reviews" />
        </>
      }
      position="flex-row-reverse"
      subheading="Submit your projects, review your cohort's work, and learn patterns you'd never discover alone. Real growth happens in collaboration."
    />
  </div>
);
