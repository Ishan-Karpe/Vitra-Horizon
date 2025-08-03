import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
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
                <Text className="text-gray-600 text-xl font-bold">IK</Text>
              </View>

              {/* User Info */}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900">Ishan Karpe</Text>
                <Text className="text-gray-500 text-sm">ishan@example.com</Text>
              </View>

              {/* Edit Profile Button */}
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-blue-600 text-sm font-medium">Edit Profile ›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Information Section */}
          <View className="bg-white rounded-lg shadow-sm mx-6 mb-6">
            {/* Joined Row */}
            <View className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">📅</Text>
                <Text className="text-gray-700">Joined</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">July 2025</Text>
            </View>

            {/* Goal Row */}
            <View className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">🎯</Text>
                <Text className="text-gray-700">Goal</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">Cut body fat to 21%</Text>
            </View>

            {/* Activity Row */}
            <View className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">🏃</Text>
                <Text className="text-gray-700">Activity</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">Strength & Cardio 4x/wk</Text>
            </View>

            {/* Diet Row */}
            <View className="flex-row justify-between items-center py-4 px-6">
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">🥗</Text>
                <Text className="text-gray-700">Diet</Text>
              </View>
              <Text className="text-gray-900 font-medium text-right">200 Cal deficit</Text>
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
              className="flex-row justify-between items-center py-4 px-6"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text className="mr-3 text-lg">❓</Text>
                <Text className="text-gray-700">Help & Support</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-500 rounded-lg py-4 mx-6 mb-8"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-lg">Log Out</Text>
          </TouchableOpacity>

          {/* Bottom spacing for tab bar */}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
