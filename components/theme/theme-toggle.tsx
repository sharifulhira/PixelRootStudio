"use client";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
}

function getCurrentTheme(): ThemeMode {
  const htmlTheme = document.documentElement.getAttribute("data-theme");
  if (htmlTheme === "dark" || htmlTheme === "light") {
    return htmlTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const handleToggle = () => {
    const nextTheme: ThemeMode = getCurrentTheme() === "light" ? "dark" : "light";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label="Toggle dark and light mode"
    >
      Theme
    </button>
  );
}
