"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useRef } from "react";
import heroStats from "@/public/assets/hero-stat.webp";
import { Button } from "../ui/button";
import HighlightText from "./highlighted-text";
import LaserFlow from "./lazer-flow";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealImgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!(containerRef.current && revealImgRef.current)) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const el = revealImgRef.current;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (revealImgRef.current) {
      revealImgRef.current.style.setProperty("--mx", "-9999px");
      revealImgRef.current.style.setProperty("--my", "-9999px");
    }
  };

  return (
    <div
      className="mask-[linear-gradient(to_bottom,black_80%,transparent_100%)] relative h-[800px] w-full overflow-hidden [webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] md:h-[950px] lg:h-[1050px]"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* --- Background Laser --- */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <LaserFlow
          color="#837AFF"
          horizontalBeamOffset={0.1}
          verticalBeamOffset={-0.1}
        />
      </div>

      {/* --- Reveal Image Effect --- */}
      <Image
        alt="Reveal effect"
        className="pointer-events-none absolute inset-0 z-20 object-cover opacity-20 mix-blend-lighten"
        fill
        ref={revealImgRef}
        src={heroStats}
        style={{
          maskImage:
            "radial-gradient(circle 300px at var(--mx, -9999px) var(--my, -9999px), black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 300px at var(--mx, -9999px) var(--my, -9999px), black 0%, transparent 100%)",
        }}
      />

      {/* --- Content Layer --- */}
      <div className="container relative z-30 mx-auto h-full w-full px-5">
        {/* Text Section: */}
        <div className="flex max-w-2xl flex-col items-start pt-20 md:pt-32">
          <h1 className="text-balance bg-linear-to-br from-30% from-black to-black/40 bg-clip-text font-bold text-4xl text-transparent leading-tight md:text-6xl dark:from-white dark:to-white/40">
            Unlock Your Potential with In-Demand{" "}
            <HighlightText text={"Coding Skills"} />
          </h1>

          <p className="mt-6 text-balance text-base text-muted-foreground md:text-xl">
            Learn to code at your own pace, anywhere, with access to hands-on
            projects, quizzes, and personalized feedback.
          </p>

          <div className="mt-8 flex flex-row gap-4">
            <Button asChild size="lg" variant={"default"}>
              <Link href="/signup">See in action</Link>
            </Button>
          </div>
        </div>

        <div className="absolute top-[60.1%] left-0 aspect-video w-full px-5 md:w-[90%]">
          <div className="mask-[linear-gradient(to_bottom,black_80%,transparent_100%)] relative h-full w-full overflow-hidden rounded-t-[20px] border-4 border-[#FFF] border-b-0 shadow-2xl [webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
            <video
              autoPlay
              className="h-full w-full object-cover"
              loop
              muted
              playsInline
            >
              <source src="/assets/banner.mp4" type="video/mp4" />
            </video>
            {/* Gloss effect */}
            <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
