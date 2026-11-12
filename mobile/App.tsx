import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { ThemeProvider, useAppTheme } from './src/theme/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { JobProvider } from './src/context/JobContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function MainApp() {
  const { isDark, paperTheme } = useAppTheme();

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" translucent />
        <RootNavigator />
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JobProvider>
          <MainApp />
        </JobProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
