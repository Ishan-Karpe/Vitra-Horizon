import "../global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AIEnhancedScenariosProvider } from "../contexts/AIEnhancedScenariosContext";
import { GoalsProvider } from "../contexts/GoalsContext";
import { UserDataProvider } from "../contexts/UserDataContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <UserDataProvider>
      <GoalsProvider>
        <AIEnhancedScenariosProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen
              name="about-yourself"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="goals" options={{ headerShown: false }} />
            <Stack.Screen name="scenario" options={{ headerShown: false }} />
            <Stack.Screen name="prediction" options={{ headerShown: false }} />
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
            <Stack.Screen
              name="create-scenario"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="edit-scenario"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="edit-profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ai-demo" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </AIEnhancedScenariosProvider>
      </GoalsProvider>
    </UserDataProvider>
  );
}
