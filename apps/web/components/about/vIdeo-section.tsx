"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="bg-linear-to-b from-background to-background/80 py-20 sm:py-32">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
            Experience ZenithAcademy
          </h2>
          <Badge className="mb-6" variant="outline">
            The Future of Learning
          </Badge>
          <p className="mt-4 mb-8 text-muted-foreground">
            Discover how ZenithAcademy is revolutionizing education through
            immersive and interactive learning experiences.
          </p>
        </div>
        <div className="relative mt-16 aspect-video overflow-hidden rounded-2xl shadow-2xl">
          <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-primary/20 to-purple-500/20 mix-blend-overlay" />
          <video
            className="h-full w-full object-cover"
            poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            ref={videoRef}
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <Button
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="h-16 w-16 rounded-full p-0 transition-transform hover:scale-110"
              onClick={togglePlay}
              size="lg"
              variant="secondary"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
          <div className="absolute right-4 bottom-4 z-20">
            <Button
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="h-10 w-10 rounded-full p-0"
              onClick={toggleMute}
              size="sm"
              variant="secondary"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h3 className="mb-2 font-semibold text-xl">
            Immersive Learning Experience
          </h3>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Our cutting-edge platform combines interactive lessons, real-time
            collaboration, and personalized feedback to create an unparalleled
            educational journey.
          </p>
        </div>
      </div>
    </section>
  );
}
