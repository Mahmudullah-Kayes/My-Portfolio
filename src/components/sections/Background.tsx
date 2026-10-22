export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="site-background pointer-events-none fixed inset-0 z-0 isolate overflow-hidden"
    >
      <div className="ambient-glow ambient-glow-teal absolute -left-48 -top-40 h-[28rem] w-[28rem] sm:h-[36rem] sm:w-[36rem]" />
      <div className="ambient-glow ambient-glow-indigo absolute -bottom-48 -right-40 h-[28rem] w-[28rem] sm:h-[36rem] sm:w-[36rem]" />
      <div className="ambient-glow ambient-glow-blue absolute right-[12%] top-[38%] h-72 w-72 sm:h-[28rem] sm:w-[28rem]" />
    </div>
  );
}