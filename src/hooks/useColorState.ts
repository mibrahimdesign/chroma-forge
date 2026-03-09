import { useState, useEffect } from "react";
import { GenerationMode } from "@/lib/color/engine";

export interface ColorConfig {
  baseColor: string;
  mode: GenerationMode;
  namingPrefix: string;
}

const DEFAULT_CONFIG: ColorConfig = {
  baseColor: "#3b82f6", // Default tailwind blue-500
  mode: "tailwind",
  namingPrefix: "primary",
};

export function useColorState() {
  const [isClient, setIsClient] = useState(false);
  
  const [config, setConfigState] = useState<ColorConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    // Push to microtask to prevent sync cascading render
    Promise.resolve().then(() => {
      setIsClient(true);
      try {
        const saved = localStorage.getItem("chroma-forge-config");
        if (saved) {
          setConfigState(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to restore config from localStorage", e);
      }
    });
  }, []);

  const setConfig = (newConfig: Partial<ColorConfig>) => {
    setConfigState((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem("chroma-forge-config", JSON.stringify(updated));
      } catch (e) {
         console.error("Failed to save config to localStorage", e);
      }
      return updated;
    });
  };

  const resetConfig = () => {
    setConfigState(DEFAULT_CONFIG);
    localStorage.removeItem("chroma-forge-config");
  };

  return {
    isClient,
    config,
    setConfig,
    resetConfig,
  };
}
