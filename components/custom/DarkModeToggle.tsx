"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_STORAGE_KEY = "theme";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const legacyTheme = localStorage.getItem("darkMode");
    if (legacyTheme) {
      localStorage.removeItem("darkMode");
      localStorage.setItem(THEME_STORAGE_KEY, legacyTheme === "true" ? "dark" : "light");
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const isDark = storedTheme ? storedTheme === "dark" : prefersDark;

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && event.newValue) {
        const shouldEnableDark = event.newValue === "dark";
        setDarkMode(shouldEnableDark);
        document.documentElement.classList.toggle("dark", shouldEnableDark);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleDarkMode = () => {
    const shouldEnableDark = !darkMode;
    setDarkMode(shouldEnableDark);
    localStorage.setItem(THEME_STORAGE_KEY, shouldEnableDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", shouldEnableDark);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="rounded-full"
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
