import { COLORS } from "../constants";

export default function Tag({ children, color }) {
  return (
    <div
      className="font-mono text-[0.62rem] sm:text-xs tracking-[2.5px] uppercase opacity-95"
      style={{ color: color || COLORS.gold }}
    >
      {children}
    </div>
  );
}