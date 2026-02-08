// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

import { Stack } from "expo-router";
import { useFonts, Silkscreen_400Regular, Silkscreen_700Bold } from '@expo-google-fonts/silkscreen';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
    Silkscreen_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}