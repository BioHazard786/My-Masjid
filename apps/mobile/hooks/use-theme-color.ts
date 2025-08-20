import { useColorScheme } from "react-native";

// Single source of truth for all color definitions
export const themes = {
  light: {
    primary: "#2d3748",
    secondary: "#5f6c80",
    background: "#f2f2f2",
    border: "#cbd5e0",
    tertiary: "#cbd5e0",
    card: "#e2e8f0",
    accent: "#387D6C",
    accentBackground: "#CCF3EA",
    surface: "#f1f5f9",
  },
  dark: {
    primary: "#cbd5e0",
    secondary: "#7f8ea3",
    background: "#1c222e",
    border: "#2d3748",
    tertiary: "#4a5568",
    card: "#2d3748",
    accent: "#76c2af",
    accentBackground: "#023B37",
    surface: "#334155",
  },
} as const;

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  border: string;
  tertiary: string;
  card: string;
  accent: string;
  accentBackground: string;
  surface: string;
};

export type ColorScheme = keyof typeof themes;

export function useThemeColors(): ThemeColors {
  const colorScheme = useColorScheme();
  return themes[colorScheme ?? "light"];
}

// Helper function to get colors for a specific scheme without the hook
export function getThemeColors(scheme: ColorScheme): ThemeColors {
  return themes[scheme];
}
