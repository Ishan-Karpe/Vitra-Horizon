import { router } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAIEnhancedScenarios } from "../../contexts/AIEnhancedScenariosContext";
import { useGoals } from "../../contexts/GoalsContext";
import { useUserData } from "../../contexts/UserDataContext";

export default function ProfileScreen() {
  const { userData, resetUserData } = useUserData();
  const { goalsData, resetGoals } = useGoals();
  const { clearAllScenarios } = useAIEnhancedScenarios();

  const handleEditProfile = () => {
    router.push("/edit-profile" as any);
  };

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");

      // Clear all app data
      console.log("Resetting user data...");
      await resetUserData();

      console.log("Resetting goals...");
      await resetGoals();

      console.log("Clearing scenarios...");
      await clearAllScenarios();

      console.log("Navigating to welcome screen...");
      // Navigate to welcome screen immediately
      router.replace("/welcome");

      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert(
        "Error",
        `There was an error logging out: ${error}. Please try again.`,
      );
    }
  };

  // Helper functions for display
  const getDisplayName = () => {
    return userData.name || "User";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getHeightDisplay = () => {
    return `${userData.heightFeet}'${userData.heightInches}"`;
  };

  const getGoalDisplay = () => {
    if (!goalsData.selectedGoal) return "No goal set";

    const goalMap: { [key: string]: string } = {
      "lose-fat": "Lose Fat",
      "build-muscle": "Build Muscle",
      "body-recomposition": "Body Recomposition",
    };

    const goalName = goalMap[goalsData.selectedGoal] || goalsData.selectedGoal;
    return `${goalName} to ${Number(goalsData.targetBodyFat).toFixed(1)}%`;
  };

  const getActivityDisplay = () => {
    const activityMap: { [key: string]: string } = {
      sedentary: "Sedentary",
      "lightly-active": "Lightly Active",
      "moderately-active": "Moderately Active",
      "very-active": "Very Active",
      "extremely-active": "Extremely Active",
    };

    return activityMap[userData.activityLevel] || "Not specified";
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white border-b border-gray-200 mb-6">
          <View className="px-6 py-4">
            <Text className="text-2xl font-bold text-gray-900">Profile</Text>
          </View>
        </View>

        {/* Profile Content */}
        <View className="flex-1">
          {/* User Profile Card */}
          <View className="bg-white rounded-lg shadow-sm mx-6 mb-6 p-6">
            <View className="flex-row items-center">
              {/* Avatar Circle */}
              <View className="w-16 h-16 bg-gray-300 rounded-full items-center justify-center mr-4">
                <Text className="text-gray-600 text-xl font-bold">
                  {getInitials()}
                </Text>
              </View>

              {/* User Info */}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900">
                  {getDisplayName()}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {userData.age
                    ? `${userData.age} years old`
                    : "Age not specified"}
                  {userData.gender ? ` • ${userData.gender}` : ""}
                </Text>
              </View>

              {/* Edit Profile Button */}
              <TouchableOpacity activeOpacity={0.7} onPress={handleEditProfile}>
                <Text className="text-blue-600 text-sm font-medium">
                  Edit Profile ›
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Information Section */}
          <View className="bg-white rounded-lg shadow-sm mx-6 mb-6">
            {/* Physical Stats Row */}
            <View className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">📏</Text>
                <Text className="text-gray-700">Physical Stats</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">
                {Math.round(userData.weight)} lbs • {getHeightDisplay()} •{" "}
                {Number(userData.bodyFatPercentage).toFixed(1)}% BF
              </Text>
            </View>

            {/* Goal Row */}
            <View className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">🎯</Text>
                <Text className="text-gray-700">Goal</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">
                {getGoalDisplay()}
              </Text>
            </View>

            {/* Activity Row */}
            <View className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">🏃</Text>
                <Text className="text-gray-700">Activity Level</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">
                {getActivityDisplay()}
              </Text>
            </View>

            {/* Timeline Row */}
            <View className="flex-row justify-between items-center py-4 px-6">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">⏱️</Text>
                <Text className="text-gray-700">Timeline</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">
                {goalsData.timelineWeeks} weeks
              </Text>
            </View>
          </View>

          {/* Settings Section */}
          <View className="bg-white rounded-lg shadow-sm mx-6 mb-6">
            {/* Change Password Row */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">🔒</Text>
                <Text className="text-gray-700">Change Password</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>

            {/* Export Progress Data Row */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">📊</Text>
                <Text className="text-gray-700">Export Progress Data</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>

            {/* Help & Support Row */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">❓</Text>
                <Text className="text-gray-700">Help & Support</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>

            {/* Log Out Row */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-4 px-6"
              activeOpacity={0.7}
              onPress={() => {
                console.log("🔥 TouchableOpacity pressed!");
                handleLogout();
              }}
            >
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">🚪</Text>
                <Text className="text-red-600 font-medium">Log Out</Text>
              </View>
              <Text className="text-red-400 text-lg">›</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom spacing for tab bar */}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
