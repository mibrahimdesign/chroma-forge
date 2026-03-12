import { useCallback, useSyncExternalStore } from "react";
import { GenerationMode, safeParseColor } from "@/lib/color/engine";
import {
  sanitizeGroupName,
  sanitizeKey,
  sanitizeStoredColorConfig,
} from "@/lib/security/validation";

export interface ColorConfig {
  baseColor: string;
  mode: GenerationMode;
  groupName: string;
  namingPrefix: string;
  shadeOverrides: Partial<Record<string, string>>;
}

const DEFAULT_CONFIG: ColorConfig = {
  baseColor: "#3b82f6",
  mode: "tailwind",
  groupName: "Primary Blue",
  namingPrefix: "primary",
  shadeOverrides: {},
};

const STORAGE_KEY = "chroma-forge-config";
const colorStateListeners = new Set<() => void>();
let cachedStorageValue: string | null | undefined;
let cachedConfigSnapshot: ColorConfig = DEFAULT_CONFIG;

function emitColorStateChange() {
  colorStateListeners.forEach((listener) => listener());
}

function getStoredConfigSnapshot(): ColorConfig {
  if (typeof window === "undefined") {
    return DEFAULT_CONFIG;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === cachedStorageValue) {
      return cachedConfigSnapshot;
    }

    cachedStorageValue = saved;
    cachedConfigSnapshot = saved
      ? sanitizeStoredColorConfig(JSON.parse(saved) as unknown, DEFAULT_CONFIG)
      : DEFAULT_CONFIG;
  } catch {
    cachedStorageValue = null;
    cachedConfigSnapshot = DEFAULT_CONFIG;
  }

  return cachedConfigSnapshot;
}

function subscribeToColorState(listener: () => void) {
  colorStateListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      colorStateListeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    colorStateListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function persistConfig(nextConfig: ColorConfig) {
  cachedStorageValue = JSON.stringify(nextConfig);
  cachedConfigSnapshot = nextConfig;

  try {
    localStorage.setItem(STORAGE_KEY, cachedStorageValue);
  } catch {
    // Ignore storage failures so the generator remains usable.
  }
}

export function useColorState() {
  const config = useSyncExternalStore(
    subscribeToColorState,
    getStoredConfigSnapshot,
    () => DEFAULT_CONFIG
  );

  const setConfig = useCallback((newConfig: Partial<ColorConfig>) => {
    const updated: ColorConfig = {
      baseColor: newConfig.baseColor ?? config.baseColor,
      mode: newConfig.mode ?? config.mode,
      groupName:
        newConfig.groupName !== undefined
          ? sanitizeGroupName(newConfig.groupName)
          : config.groupName,
      namingPrefix:
        newConfig.namingPrefix !== undefined
          ? sanitizeKey(newConfig.namingPrefix)
          : config.namingPrefix,
      shadeOverrides: newConfig.shadeOverrides ?? config.shadeOverrides,
    };

    persistConfig(updated);
    emitColorStateChange();
  }, [config]);

  const resetConfig = useCallback(() => {
    cachedStorageValue = null;
    cachedConfigSnapshot = DEFAULT_CONFIG;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }

    emitColorStateChange();
  }, []);

  const setShadeOverride = useCallback((shadeName: string, color: string) => {
    const parsedColor = safeParseColor(color);
    if (!parsedColor) {
      return;
    }

    const updated: ColorConfig = {
      ...config,
      shadeOverrides: {
        ...config.shadeOverrides,
        [shadeName]: parsedColor.toHex(),
      },
    };

    persistConfig(updated);
    emitColorStateChange();
  }, [config]);

  const clearShadeOverride = useCallback((shadeName: string) => {
    const nextOverrides = { ...config.shadeOverrides };
    delete nextOverrides[shadeName];

    const updated: ColorConfig = {
      ...config,
      shadeOverrides: nextOverrides,
    };

    persistConfig(updated);
    emitColorStateChange();
  }, [config]);

  const clearAllShadeOverrides = useCallback(() => {
    const updated: ColorConfig = {
      ...config,
      shadeOverrides: {},
    };

    persistConfig(updated);
    emitColorStateChange();
  }, [config]);

  return {
    config,
    setConfig,
    resetConfig,
    setShadeOverride,
    clearShadeOverride,
    clearAllShadeOverrides,
  };
}
