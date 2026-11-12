import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

export type ThemeMode = 'SYSTEM' | 'LIGHT' | 'DARK';

export interface AppColors {
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  accent: string;
  chipBackground: string;
  statusBar: 'light-content' | 'dark-content';
}

const lightColors: AppColors = {
  primary: '#1d4ed8',         // Professional Blue
  primaryContainer: '#dbeafe',
  onPrimary: '#ffffff',
  background: '#f8fafc',      // Clean Light Gray
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  card: '#ffffff',
  text: '#0f172a',            // High-contrast dark text
  textSecondary: '#334155',
  textMuted: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  accent: '#2563eb',
  chipBackground: '#e2e8f0',
  statusBar: 'dark-content',
};

const darkColors: AppColors = {
  primary: '#3b82f6',         // Comfortable Bright Blue
  primaryContainer: '#1e3a8a',
  onPrimary: '#ffffff',
  background: '#090d16',      // Deep Android Slate
  surface: '#111827',
  surfaceVariant: '#1f2937',
  card: '#161f30',
  text: '#f8fafc',            // High-contrast white text
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  border: '#1e293b',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  accent: '#60a5fa',
  chipBackground: '#1e293b',
  statusBar: 'light-content',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: AppColors;
  paperTheme: MD3Theme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'SYSTEM',
  isDark: false,
  colors: lightColors,
  paperTheme: MD3LightTheme,
  setThemeMode: async () => {},
});

const THEME_STORAGE_KEY = '@job_finder_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('SYSTEM');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'LIGHT' || stored === 'DARK' || stored === 'SYSTEM') {
          setThemeModeState(stored);
        }
      } catch (e) {
        console.warn('Error reading stored theme:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Error saving theme preference:', e);
    }
  };

  const isDark =
    themeMode === 'DARK' || (themeMode === 'SYSTEM' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  const paperTheme = isDark
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          surface: colors.surface,
          error: colors.error,
        },
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          primary: colors.primary,
          background: colors.background,
          surface: colors.surface,
          error: colors.error,
        },
      };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        colors,
        paperTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
