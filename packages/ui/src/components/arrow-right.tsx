export default function ArrowRight() {
  return (
    <div
      aria-hidden
      className="all relative ml-2 flex rotate-90 items-center justify-center gap-0.5 Agroup-hover:text-[#0099ff] transition-all"
    >
      <div className="h-[7px] w-[2px] rotate-45 rounded-xl bg-current duration-300" />
      <div className="-rotate-45 h-[7px] w-[2px] rounded-xl bg-current duration-300" />
      <div className="-translate-x-[calc(50%+.1px)] absolute top-0.5 left-1/2 h-0 w-[2px] origin-top rounded-xl bg-current transition-all duration-300 will-change-transform group-hover:h-3" />
    </div>
  );
}
