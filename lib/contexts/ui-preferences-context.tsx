"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getStoredPreference, setStoredPreference } from "@/lib/utils";

interface UIPreferences {
  contrast: "normal" | "high";
  reducedMotion: boolean;
  sidebarCollapsed: boolean;
  contractViewMode: "card" | "list";
}

interface UIPreferencesContextValue extends UIPreferences {
  setContrast: (contrast: "normal" | "high") => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setContractViewMode: (mode: "card" | "list") => void;
}

const defaultPreferences: UIPreferences = {
  contrast: "normal",
  reducedMotion: false,
  sidebarCollapsed: false,
  contractViewMode: "card",
};

const UIPreferencesContext = createContext<UIPreferencesContextValue | null>(null);

export function UIPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UIPreferences>(defaultPreferences);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = getStoredPreference<Partial<UIPreferences>>("plume-ui-prefs", {});
    
    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    setPreferences({
      ...defaultPreferences,
      ...stored,
      reducedMotion: stored.reducedMotion ?? prefersReducedMotion,
    });
    setMounted(true);
  }, []);

  // Apply contrast mode to document
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-contrast", preferences.contrast);
  }, [preferences.contrast, mounted]);

  // Save preferences to localStorage
  useEffect(() => {
    if (!mounted) return;
    setStoredPreference("plume-ui-prefs", preferences);
  }, [preferences, mounted]);

  const setContrast = (contrast: "normal" | "high") => {
    setPreferences((prev) => ({ ...prev, contrast }));
  };

  const setReducedMotion = (reducedMotion: boolean) => {
    setPreferences((prev) => ({ ...prev, reducedMotion }));
  };

  const setSidebarCollapsed = (sidebarCollapsed: boolean) => {
    setPreferences((prev) => ({ ...prev, sidebarCollapsed }));
  };

  const setContractViewMode = (contractViewMode: "card" | "list") => {
    setPreferences((prev) => ({ ...prev, contractViewMode }));
  };

  return (
    <UIPreferencesContext.Provider
      value={{
        ...preferences,
        setContrast,
        setReducedMotion,
        setSidebarCollapsed,
        setContractViewMode,
      }}
    >
      {children}
    </UIPreferencesContext.Provider>
  );
}

export function useUIPreferences() {
  const context = useContext(UIPreferencesContext);
  if (!context) {
    throw new Error("useUIPreferences must be used within UIPreferencesProvider");
  }
  return context;
}
