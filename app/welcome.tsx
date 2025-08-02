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
      <View className="flex-1 px-8 py-12 justify-between">
        {/* Hero Section */}
        <View className="items-center mt-16">
          <Hero
            title="Welcome to Vitra Morph"
            subtitle="Transform your fitness journey with AI-powered predictions and personalized recommendations"
          />
        </View>

        {/* Features Section */}
        <View className="flex-1 justify-center space-y-6 mt-12 mb-12">
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
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-blue-600 px-8 py-5 rounded-lg"
            onPress={handleConnectHealthApps}
          >
            <Text className="text-white text-xl font-semibold text-center">
              Connect Health Apps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border-2 border-blue-600 px-8 py-5 rounded-lg"
            onPress={handleManualSetup}
          >
            <Text className="text-blue-600 text-xl font-semibold text-center">
              Manual Setup
            </Text>
          </TouchableOpacity>

          {/* Test button with direct navigation */}
          <TouchableOpacity
            className="bg-gray-600 px-8 py-5 rounded-lg"
            onPress={() => {
              console.log('TEST button pressed - navigating directly');
              router.push('/about-yourself');
            }}
          >
            <Text className="text-white text-xl font-semibold text-center">
              TEST - Direct Navigation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View className="items-center">
          <Text className="text-sm text-gray-600 text-center">
            🔒 Privacy: Your data stays secure
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
