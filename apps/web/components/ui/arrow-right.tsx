export default function ArrowRight() {
  return (
    <div
      aria-hidden
      className="relative flex items-center justify-center gap-0.5 all ml-2 rotate-90 transition-all Agroup-hover:text-[#0099ff]"
    >
      <div className="rotate-45 rounded-xl bg-current duration-300 h-[7px] w-[2px]"></div>
      <div className="-rotate-45 rounded-xl bg-current duration-300 h-[7px] w-[2px]"></div>
      <div className="absolute left-1/2 top-0.5 origin-top -translate-x-[calc(50%+.1px)] rounded-xl bg-current transition-all duration-300 will-change-transform w-[2px] h-0 group-hover:h-3"></div>
    </div>
  )
}
