import { useTheme } from "@/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

export const ModeToggle: React.FC = () => {
  const { theme, setTheme, isDark, toggle } = useTheme();

  return (
    <fieldset
      className="inline-flex items-center gap-0 rounded-xl border border-border p-0.5"
      role="radiogroup"
    >
      <legend className="sr-only">Theme</legend>

      {/* Light */}
      <label
        className={[
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer select-none",
          theme === "light"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground hover:bg-secondary",
        ].join(" ")}
      >
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === "light"}
          onChange={() => setTheme("light")}
          className="sr-only"
          aria-checked={theme === "light"}
        />
        <Sun className="h-4 w-4" />
        <span className="hidden sm:inline text-sm font-medium">Light</span>
      </label>

      {/* Dark */}
      <label
        className={[
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer select-none",
          theme === "dark"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground hover:bg-secondary",
        ].join(" ")}
      >
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={theme === "dark"}
          onChange={() => setTheme("dark")}
          className="sr-only"
          aria-checked={theme === "dark"}
        />
        <Moon className="h-4 w-4" />
        <span className="hidden sm:inline text-sm font-medium">Dark</span>
      </label>

      {/* Optional: tap-to-toggle behavior on very small screens */}
      <button
        type="button"
        onClick={toggle}
        className="sm:hidden absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Toggle to ${isDark ? "light" : "dark"} mode`}
        tabIndex={-1}
      />
    </fieldset>
  );
};
