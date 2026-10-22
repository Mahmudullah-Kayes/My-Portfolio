export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.12),transparent_45%)]" />
    </div>
  );
}