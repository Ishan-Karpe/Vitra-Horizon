import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { useUserData } from '../contexts/UserDataContext';

export default function EditProfileScreen() {
  const { userData, updateUserData, validateField, validateAllFields } = useUserData();
  
  // Local state for form data
  const [formData, setFormData] = useState({
    name: userData.name || '',
    age: userData.age?.toString() || '',
    gender: userData.gender || '',
    weight: userData.weight.toString(),
    heightFeet: userData.heightFeet.toString(),
    heightInches: userData.heightInches.toString(),
    bodyFatPercentage: userData.bodyFatPercentage.toString(),
    activityLevel: userData.activityLevel
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSaving(true);

    try {
      // Convert string values to numbers where needed
      const updatedData = {
        name: formData.name.trim() || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        weight: parseFloat(formData.weight),
        heightFeet: parseInt(formData.heightFeet),
        heightInches: parseInt(formData.heightInches),
        bodyFatPercentage: Math.round(parseFloat(formData.bodyFatPercentage) * 10) / 10,
        activityLevel: formData.activityLevel
      };

      // Update user data (this will trigger validation and storage)
      updateUserData(updatedData);

      // Validate all fields
      const isValid = validateAllFields();
      
      if (isValid) {
        Alert.alert(
          'Success',
          'Your profile has been updated successfully!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Validation Error',
          'Please check your inputs and try again.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
              <Text className="text-blue-600 text-lg">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
            <TouchableOpacity 
              onPress={handleSave} 
              activeOpacity={0.7}
              disabled={isSaving}
            >
              <Text className={`text-lg font-semibold ${isSaving ? 'text-gray-400' : 'text-blue-600'}`}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Personal Information Section */}
          <View className="bg-white rounded-lg shadow-sm mx-6 mt-6 mb-4">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">Personal Information</Text>
            </View>
            
            {/* Name Field */}
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Name</Text>
              <TextInput
                className="text-lg text-gray-900 py-2"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Age Field */}
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Age</Text>
              <TextInput
                className="text-lg text-gray-900 py-2"
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder="Enter your age"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            {/* Gender Field */}
            <View className="px-6 py-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Gender</Text>
              <View className="flex-row space-x-4">
                {['Male', 'Female', 'Other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleInputChange('gender', option)}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.gender === option
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-sm font-medium ${
                      formData.gender === option ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Health Information Section */}
          <View className="bg-white rounded-lg shadow-sm mx-6 mb-4">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">Health Information</Text>
            </View>
            
            {/* Weight Field */}
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Weight (lbs)</Text>
              <TextInput
                className="text-lg text-gray-900 py-2"
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                placeholder="Enter your weight"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            {/* Height Fields */}
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Height</Text>
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <TextInput
                    className="text-lg text-gray-900 py-2 text-center border border-gray-300 rounded-lg"
                    value={formData.heightFeet}
                    onChangeText={(value) => handleInputChange('heightFeet', value)}
                    placeholder="Feet"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <TextInput
                    className="text-lg text-gray-900 py-2 text-center border border-gray-300 rounded-lg"
                    value={formData.heightInches}
                    onChangeText={(value) => handleInputChange('heightInches', value)}
                    placeholder="Inches"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Body Fat Percentage Field */}
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Body Fat Percentage (%)</Text>
              <TextInput
                className="text-lg text-gray-900 py-2"
                value={formData.bodyFatPercentage}
                onChangeText={(value) => handleInputChange('bodyFatPercentage', value)}
                placeholder="Enter your body fat percentage"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            {/* Activity Level Field */}
            <View className="px-6 py-4">
              <Text className="text-sm font-medium text-gray-700 mb-3">Activity Level</Text>
              <View className="space-y-2">
                {[
                  { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
                  { value: 'lightly-active', label: 'Lightly Active (light exercise 1-3 days/week)' },
                  { value: 'moderately-active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
                  { value: 'very-active', label: 'Very Active (hard exercise 6-7 days/week)' },
                  { value: 'extremely-active', label: 'Extremely Active (very hard exercise, physical job)' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleInputChange('activityLevel', option.value)}
                    className={`p-3 rounded-lg border ${
                      formData.activityLevel === option.value
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-sm ${
                      formData.activityLevel === option.value ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom spacing */}
          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
