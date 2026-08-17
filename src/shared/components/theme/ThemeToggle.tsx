import "./ThemeToggle.css";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  getTheme,
  setTheme,
  type ThemeMode,
} from "../../theme/theme";

export default function ThemeToggle() {
  const [
    theme,
    setCurrentTheme,
  ] =
    useState<ThemeMode>(
      getTheme(),
    );

  const isDark =
    theme === "dark";

  const toggle = () => {
    const nextTheme:
      ThemeMode =
        isDark
          ? "light"
          : "dark";

    setTheme(
      nextTheme,
    );

    setCurrentTheme(
      nextTheme,
    );
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={
        isDark
          ? "Cambiar a tema claro"
          : "Cambiar a tema oscuro"
      }
      title={
        isDark
          ? "Tema claro"
          : "Tema oscuro"
      }
      aria-pressed={isDark}
    >
      <span
        className="theme-toggle__icon"
        aria-hidden="true"
      >
        {isDark ? (
          <Sun size={16} />
        ) : (
          <Moon size={16} />
        )}
      </span>

      <span
        className="theme-toggle__label"
      >
        {isDark
          ? "Claro"
          : "Oscuro"}
      </span>
    </button>
  );
}