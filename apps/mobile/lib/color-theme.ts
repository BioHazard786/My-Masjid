import type { ThemeColors } from "@mobile/hooks/use-theme-color";
import { themes as themeColors } from "@mobile/hooks/use-theme-color";
import { vars } from "nativewind";

// Convert theme colors to CSS variables for NativeWind
function convertToCSSVars(colors: ThemeColors) {
  return vars({
    "--color-primary": colors.primary,
    "--color-secondary": colors.secondary,
    "--color-background": colors.background,
    "--color-border": colors.border,
    "--color-tertiary": colors.tertiary,
    "--color-card": colors.card,
    "--color-accent": colors.accent,
    "--color-accent-background": colors.accentBackground,
    "--color-surface": colors.surface,
  });
}

export const themes = {
  light: convertToCSSVars(themeColors.light),
  dark: convertToCSSVars(themeColors.dark),
};
