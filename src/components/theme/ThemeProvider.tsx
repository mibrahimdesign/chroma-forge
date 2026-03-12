"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { sanitizeThemeValue } from "@/lib/security/validation";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "chroma-forge-theme";
const themeListeners = new Set<() => void>();

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return sanitizeThemeValue(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

function getThemeSnapshot(): ThemeMode {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "dark";
}

function getServerThemeSnapshot(): ThemeMode {
  return "dark";
}

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      themeListeners.delete(listener);
    };
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  const handleSystemThemeChange = () => {
    if (!getStoredTheme()) {
      listener();
    }
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      listener();
    }
  };

  mediaQuery.addEventListener("change", handleSystemThemeChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    themeListeners.delete(listener);
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage failures so theme switching never breaks rendering.
    }

    applyTheme(nextTheme);
    emitThemeChange();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
