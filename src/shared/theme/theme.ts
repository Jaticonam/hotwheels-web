export type ThemeMode =
  | "light"
  | "dark";

export const DEFAULT_THEME: ThemeMode =
  "light";

/*
 * V2 deliberately ignores the previous experimental
 * dark-first storage key.
 */
const STORAGE_KEY =
  "hotwheels_theme_v2";

const isThemeMode = (
  value: string | null,
): value is ThemeMode =>
  value === "light" ||
  value === "dark";

const applyTheme = (
  theme: ThemeMode,
) => {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  const root =
    document.documentElement;

  root.dataset.theme =
    theme;

  root.style.colorScheme =
    theme;
};

export const getTheme =
  (): ThemeMode => {
    if (
      typeof window ===
      "undefined"
    ) {
      return DEFAULT_THEME;
    }

    const stored =
      window.localStorage
        .getItem(
          STORAGE_KEY,
        );

    return isThemeMode(
      stored,
    )
      ? stored
      : DEFAULT_THEME;
  };

export const initializeTheme =
  (): ThemeMode => {
    const theme =
      getTheme();

    applyTheme(
      theme,
    );

    return theme;
  };

export const setTheme = (
  theme: ThemeMode,
): ThemeMode => {
  if (
    typeof window !==
    "undefined"
  ) {
    window.localStorage
      .setItem(
        STORAGE_KEY,
        theme,
      );
  }

  applyTheme(
    theme,
  );

  return theme;
};