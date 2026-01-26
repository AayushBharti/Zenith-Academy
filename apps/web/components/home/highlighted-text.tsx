export default function HighlightText({ text }: { text?: string }) {
  return (
    <span className="inline-block animate-gradient bg-linear-to-r bg-size-[200%_auto] from-[#06b7f9] via-[#194aec] to-[#06b7f9] bg-clip-text pb-1 font-bold text-transparent tracking-tighter">
      {" "}
      {text}
    </span>
  );
}
