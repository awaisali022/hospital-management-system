import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const themes = [
  'midnight',
  'dark',
  'clinical',
  'light',
  'emerald',
  'azure',
  'onyx',
  'pulse',
  'nova',
  'sterile',
  'cobalt',
  'custom'
] as const;

export type ThemeName = (typeof themes)[number];

export interface CustomThemeColors {
  background: string;
  foreground: string;
  primary: string;
  accent: string;
  border: string;
}

interface ThemeState {
  theme: ThemeName;
  customThemeColors: CustomThemeColors;
  setTheme: (theme: ThemeName) => void;
  setCustomColors: (colors: Partial<CustomThemeColors>) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'midnight',
      customThemeColors: {
        background: '222 47% 5%',
        foreground: '190 40% 96%',
        primary: '174 91% 48%',
        accent: '265 89% 72%',
        border: '200 28% 24%'
      },
      setTheme: (theme) => set({ theme }),
      setCustomColors: (colors) =>
        set((state) => ({
          customThemeColors: { ...state.customThemeColors, ...colors }
        }))
    }),
    { name: 'doctor-hub-theme' }
  )
);

