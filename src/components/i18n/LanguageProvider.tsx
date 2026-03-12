"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { sanitizeLanguageValue } from "@/lib/security/validation";

export type Language = "en" | "ar";

const LANGUAGE_STORAGE_KEY = "chroma-forge-language";
const languageListeners = new Set<() => void>();

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyLanguage(language: Language) {
  const root = document.documentElement;
  root.lang = language;
  root.dir = language === "ar" ? "rtl" : "ltr";
  root.dataset.language = language;
}

function getStoredLanguage(): Language | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return sanitizeLanguageValue(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
}

function getLanguageSnapshot(): Language {
  return getStoredLanguage() ?? "en";
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

function emitLanguageChange() {
  languageListeners.forEach((listener) => listener());
}

function subscribeToLanguage(listener: () => void) {
  languageListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      languageListeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === LANGUAGE_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    languageListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );

  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // Ignore storage failures so language switching never breaks rendering.
    }

    applyLanguage(nextLanguage);
    emitLanguageChange();
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "ar" : "en");
  }, [language, setLanguage]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
