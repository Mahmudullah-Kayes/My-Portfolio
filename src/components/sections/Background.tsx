export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 isolate overflow-hidden bg-black"
    >
      <div className="ambient-glow ambient-glow-teal absolute -left-48 -top-48 h-96 w-96 sm:h-[32rem] sm:w-[32rem]" />
      <div className="ambient-glow ambient-glow-indigo absolute -bottom-48 -right-48 h-96 w-96 sm:h-[32rem] sm:w-[32rem]" />
    </div>
  );
}