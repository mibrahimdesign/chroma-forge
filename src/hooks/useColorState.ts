import { useCallback, useSyncExternalStore } from "react";
import { GenerationMode, safeParseColor } from "@/lib/color/engine";
import {
  sanitizeGroupName,
  sanitizeKey,
  sanitizeStoredColorConfig,
} from "@/lib/security/validation";

export interface ColorConfig {
  id: string;
  baseColor: string;
  mode: GenerationMode;
  groupName: string;
  namingPrefix: string;
  shadeOverrides: Partial<Record<string, string>>;
}

export interface ThemeState {
  palettes: ColorConfig[];
  activeId: string;
}

const DEFAULT_PALETTE: ColorConfig = {
  id: "primary",
  baseColor: "#3b82f6",
  mode: "tailwind",
  groupName: "Primary Blue",
  namingPrefix: "primary",
  shadeOverrides: {},
};

const DEFAULT_STATE: ThemeState = {
  palettes: [DEFAULT_PALETTE],
  activeId: "primary",
};

const STORAGE_KEY = "chroma-forge-theme-v2";
const LEGACY_STORAGE_KEY = "chroma-forge-config"; // Single palette version
const stateListeners = new Set<() => void>();
let cachedStorageValue: string | null | undefined;
let cachedStateSnapshot: ThemeState = DEFAULT_STATE;

function emitStateChange() {
  stateListeners.forEach((listener) => listener());
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getStoredStateSnapshot(): ThemeState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    // Clear legacy single-palette state if it exists
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    // Ignore migration failures
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === cachedStorageValue) {
      return cachedStateSnapshot;
    }

    cachedStorageValue = saved;
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<ThemeState>;
      if (Array.isArray(parsed.palettes) && parsed.palettes.length > 0) {
        cachedStateSnapshot = {
          palettes: parsed.palettes.map(p => sanitizeStoredColorConfig(p as any, DEFAULT_PALETTE) as ColorConfig),
          activeId: typeof parsed.activeId === "string" ? parsed.activeId : parsed.palettes[0].id,
        };
      } else {
        cachedStateSnapshot = DEFAULT_STATE;
      }
    } else {
      cachedStateSnapshot = DEFAULT_STATE;
    }
  } catch {
    cachedStorageValue = null;
    cachedStateSnapshot = DEFAULT_STATE;
  }

  return cachedStateSnapshot;
}

function subscribeToState(listener: () => void) {
  stateListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      stateListeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    stateListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function persistState(nextState: ThemeState) {
  cachedStorageValue = JSON.stringify(nextState);
  cachedStateSnapshot = nextState;

  try {
    localStorage.setItem(STORAGE_KEY, cachedStorageValue);
  } catch {
    // Ignore storage failures
  }
}

export function useColorState() {
  const state = useSyncExternalStore(subscribeToState, getStoredStateSnapshot, () => DEFAULT_STATE);

  const activePalette = state.palettes.find(p => p.id === state.activeId) || state.palettes[0];

  const setActivePalette = useCallback((id: string) => {
    if (state.palettes.some(p => p.id === id)) {
      const updated = { ...state, activeId: id };
      persistState(updated);
      emitStateChange();
    }
  }, [state]);

  const addPalette = useCallback((baseConfig: Partial<ColorConfig> = {}) => {
    const newId = generateId();
    const newPalette: ColorConfig = {
      ...DEFAULT_PALETTE,
      ...baseConfig,
      id: newId,
      namingPrefix: baseConfig.namingPrefix ? sanitizeKey(baseConfig.namingPrefix) : `color-${state.palettes.length + 1}`,
      groupName: baseConfig.groupName ? sanitizeGroupName(baseConfig.groupName) : `Color ${state.palettes.length + 1}`,
      shadeOverrides: {},
    };
    
    const updated = {
      palettes: [...state.palettes, newPalette],
      activeId: newId,
    };
    
    persistState(updated);
    emitStateChange();
  }, [state]);

  const removePalette = useCallback((id: string) => {
    if (state.palettes.length <= 1) return; // Prevent removing last palette
    
    const filtered = state.palettes.filter(p => p.id !== id);
    const updated = {
      palettes: filtered,
      activeId: state.activeId === id ? filtered[filtered.length - 1].id : state.activeId,
    };
    
    persistState(updated);
    emitStateChange();
  }, [state]);

  const updateActivePalette = useCallback((changes: Partial<ColorConfig>) => {
    const updatedPalettes = state.palettes.map(p => {
      if (p.id !== state.activeId) return p;
      return {
        ...p,
        baseColor: changes.baseColor ?? p.baseColor,
        mode: changes.mode ?? p.mode,
        groupName: changes.groupName !== undefined ? sanitizeGroupName(changes.groupName) : p.groupName,
        namingPrefix: changes.namingPrefix !== undefined ? sanitizeKey(changes.namingPrefix) : p.namingPrefix,
      };
    });

    persistState({ ...state, palettes: updatedPalettes });
    emitStateChange();
  }, [state]);

  const setShadeOverride = useCallback((shadeName: string, color: string) => {
    const parsedColor = safeParseColor(color);
    if (!parsedColor) return;

    const updatedPalettes = state.palettes.map(p => {
      if (p.id !== state.activeId) return p;
      return {
        ...p,
        shadeOverrides: {
          ...p.shadeOverrides,
          [shadeName]: parsedColor.toHex(),
        },
      };
    });

    persistState({ ...state, palettes: updatedPalettes });
    emitStateChange();
  }, [state]);

  const clearShadeOverride = useCallback((shadeName: string) => {
    const updatedPalettes = state.palettes.map(p => {
      if (p.id !== state.activeId) return p;
      const nextOverrides = { ...p.shadeOverrides };
      delete nextOverrides[shadeName];
      return { ...p, shadeOverrides: nextOverrides };
    });

    persistState({ ...state, palettes: updatedPalettes });
    emitStateChange();
  }, [state]);

  const clearAllShadeOverrides = useCallback(() => {
    const updatedPalettes = state.palettes.map(p => {
      if (p.id !== state.activeId) return p;
      return { ...p, shadeOverrides: {} };
    });

    persistState({ ...state, palettes: updatedPalettes });
    emitStateChange();
  }, [state]);

  const resetAllState = useCallback(() => {
    cachedStorageValue = null;
    cachedStateSnapshot = DEFAULT_STATE;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    emitStateChange();
  }, []);

  return {
    state,
    activePalette,
    setActivePalette,
    addPalette,
    removePalette,
    updateActivePalette,
    setShadeOverride,
    clearShadeOverride,
    clearAllShadeOverrides,
    resetAllState,
  };
}
