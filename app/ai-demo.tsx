import React from "react";
import { SafeAreaView } from "react-native";
import { AIBackendDemo } from "../components/demo/AIBackendDemo";

export default function AIDemoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AIBackendDemo />
    </SafeAreaView>
  );
}
