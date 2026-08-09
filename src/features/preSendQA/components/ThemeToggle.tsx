import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";

const storageKey = "pre-send-qa-theme";
type ThemeMode = "light" | "dark" | "system";

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark" || value === "system";

const getInitialMode = (): ThemeMode => {
  if (typeof localStorage === "undefined") {
    return "system";
  }

  const stored = localStorage.getItem(storageKey);
  return isThemeMode(stored) ? stored : "system";
};

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const darkMode = mode === "dark" || (mode === "system" && media.matches);
      document.documentElement.classList.toggle("dark", darkMode);
      document.documentElement.dataset.theme = mode;

      try {
        localStorage.setItem(storageKey, mode);
      } catch {
        /* Theme preference is optional. */
      }
    };

    applyTheme();
    media.addEventListener("change", applyTheme);

    return () => media.removeEventListener("change", applyTheme);
  }, [mode]);

  const options: Array<{ mode: ThemeMode; label: string; icon: typeof Sun }> = [
    { mode: "light", label: "Light", icon: Sun },
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "system", label: "System", icon: Monitor },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const selected = mode === option.mode;

        return (
          <button
            key={option.mode}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cn(
              "inline-flex min-h-8 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition",
              selected
                ? "bg-app-primary text-white"
                : "text-app-soft hover:bg-slate-100 hover:text-app-primaryDark",
            )}
            onClick={() => setMode(option.mode)}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
