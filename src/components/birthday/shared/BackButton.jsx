import { COLORS } from "../constants";

// -----------------------------
// Shared back button — used by every quest screen.
// Positioned `fixed` (not `sticky`) so it sits at the exact same
// spot on every page, regardless of that page's own layout,
// padding, or vertical centering. Tweak `top-14` below to nudge
// it up/down globally — every page moves together.
// -----------------------------
export default function BackButton({ onClick, label = "back" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed top-14 left-3 sm:left-5 z-20 flex items-center gap-1 text-sm sm:text-base opacity-80 hover:opacity-100 transition-opacity"
      style={{ color: COLORS.brownSoft }}
    >
      <span>←</span>
      <span>{label}</span>
    </button>
  );
}
