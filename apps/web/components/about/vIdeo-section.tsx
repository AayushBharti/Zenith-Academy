"use client"

import { useRef, useState } from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Experience ZenithAcademy
          </h2>
          <Badge variant="outline" className="mb-6">
            The Future of Learning
          </Badge>
          <p className="text-muted-foreground mt-4 mb-8">
            Discover how ZenithAcademy is revolutionizing education through
            immersive and interactive learning experiences.
          </p>
        </div>
        <div className="mt-16 aspect-video relative overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 mix-blend-overlay pointer-events-none z-10" />
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full w-16 h-16 p-0 hover:scale-110 transition-transform"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
          <div className="absolute bottom-4 right-4 z-20">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
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
          <h3 className="text-xl font-semibold mb-2">
            Immersive Learning Experience
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our cutting-edge platform combines interactive lessons, real-time
            collaboration, and personalized feedback to create an unparalleled
            educational journey.
          </p>
        </div>
      </div>
    </section>
  )
}
