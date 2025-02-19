import React from "react"

export default function HighlightText({ text }: { text?: string }) {
  return (
    <span className="bg-gradient-to-br from-[#06b7f9] to-[#194aec] max-w-fit text-transparent bg-clip-text font-bold">
      {" "}
      {text}
    </span>
  )
}
