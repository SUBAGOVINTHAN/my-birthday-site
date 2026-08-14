import { COLORS } from "../constants";

export default function Btn({ children, onClick, ghost, disabled, className = "", style = {}, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "font-sans font-bold text-sm sm:text-base px-6 sm:px-8 py-3 rounded-full transition-transform duration-200",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        !disabled && "hover:-translate-y-0.5",
        className,
      ].join(" ")}
      style={
        ghost
          ? { background: "transparent", color: COLORS.rust, border: `1.5px solid ${COLORS.rust}`, ...style }
          : {
              background: `linear-gradient(100deg, ${COLORS.rust}, ${COLORS.rustSoft})`,
              color: COLORS.cream,
              boxShadow: "0 10px 22px rgba(168,69,58,0.28)",
              ...style,
            }
      }
      {...rest}
    >
      {children}
    </button>
  );
}