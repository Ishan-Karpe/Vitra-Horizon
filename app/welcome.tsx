import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { FeatureCard } from '../components/ui/FeatureCard';
import { Hero } from '../components/ui/Hero';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleConnectHealthApps = () => {
    console.log('Connect Health Apps button pressed');
    // Navigate to about yourself screen
    router.push('/about-yourself');
  };

  const handleManualSetup = () => {
    console.log('Manual Setup button pressed');
    // Navigate to about yourself screen
    router.push('/about-yourself');
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <View className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12 justify-between">
        {/* Hero Section */}
        <View className="items-center">
          <Hero
            title="Welcome to Vitra Horizon"
            subtitle="Transform your fitness journey with AI-powered predictions and personalized recommendations"
          />
        </View>

        {/* Features Section - Evenly distributed */}
        <View className="flex-1 justify-evenly py-8 sm:py-12 md:py-16">
          <FeatureCard
            emoji="🔮"
            title="Predict your body changes before they happen"
            variant="compact"
          />

          <FeatureCard
            emoji="⚡"
            title="Test different fitness plans instantly"
            variant="compact"
          />

          <FeatureCard
            emoji="📊"
            title="Get personalized recommendations with confidence scores"
            variant="compact"
          />
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 sm:space-y-4">
          <TouchableOpacity
            className="bg-blue-600 px-6 sm:px-8 py-4 sm:py-5 rounded-lg shadow-sm"
            onPress={handleConnectHealthApps}
          >
            <Text className="text-white text-lg sm:text-xl font-semibold text-center">
              Connect Health Apps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border-2 border-blue-600 px-6 sm:px-8 py-4 sm:py-5 rounded-lg"
            onPress={handleManualSetup}
          >
            <Text className="text-blue-600 text-lg sm:text-xl font-semibold text-center">
              Manual Setup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice - At bottom */}
        <View className="items-center pt-4 sm:pt-6">
          <Text className="text-xs sm:text-sm text-gray-600 text-center px-4">
            🔒 Privacy: Your data stays secure
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
