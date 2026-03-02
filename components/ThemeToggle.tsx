"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive label only after mount so server/client match
  const ariaLabel = mounted
    ? `Switch to ${theme === "light" ? "dark" : "light"} mode`
    : "Toggle theme";

  return (
    <button
      onClick={toggle}
      aria-label={ariaLabel}
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        border: "1px solid var(--color-border)",
        background: "var(--color-card)",
        color: "var(--color-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.25s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--color-terracotta)";
        (e.currentTarget as HTMLElement).style.color =
          "var(--color-terracotta)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--color-border)";
        (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
      }}
    >
      {!mounted ? null : theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
