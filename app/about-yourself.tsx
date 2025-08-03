import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ActivityLevelSelector } from '../components/ui/ActivityLevelSelector';
import { BodyFatCalculatorModal } from '../components/ui/BodyFatCalculatorModal';
import { BodyFatSlider } from '../components/ui/BodyFatSlider';
import { Button } from '../components/ui/Button';
import { HeightInput } from '../components/ui/HeightInput';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { WeightSlider } from '../components/ui/WeightSlider';
import { useUserData } from '../contexts/UserDataContext';

export default function AboutYourselfScreen() {
  const { userData, updateUserData, validateField } = useUserData();
  const [showBodyFatModal, setShowBodyFatModal] = useState(false);

  // Check if form is complete and valid (without updating state)
  const isFormValid = useMemo(() => {
    const fieldsToValidate: (keyof typeof userData)[] = [
      'weight', 'heightFeet', 'heightInches', 'bodyFatPercentage', 'activityLevel'
    ];

    return fieldsToValidate.every(field => {
      const error = validateField(field, userData[field] as number | string);
      return !error && userData[field] !== undefined && userData[field] !== '';
    });
  }, [userData, validateField]);

  const handleNext = () => {
    if (isFormValid) {
      // Navigate to Goals screen
      router.push('/goals');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleUseCalculatedBodyFat = (bodyFatPercentage: number) => {
    updateUserData('bodyFatPercentage', bodyFatPercentage);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-6 pt-6 pb-4">
          <ProgressIndicator currentStep={2} totalSteps={6} />
          <Text className="text-2xl font-bold text-gray-900 mt-6 mb-2">
            Tell us about yourself
          </Text>
        </View>

        {/* Form Content */}
        <View className="px-6 space-y-8">
          {/* Current Weight */}
          <WeightSlider
            value={userData.weight}
            onValueChange={(value) => updateUserData('weight', value)}
            min={80}
            max={200}
          />

          {/* Height */}
          <HeightInput
            feet={userData.heightFeet}
            inches={userData.heightInches}
            onFeetChange={(value) => updateUserData('heightFeet', value)}
            onInchesChange={(value) => updateUserData('heightInches', value)}
          />

          {/* Body Fat Percentage */}
          <BodyFatSlider
            value={userData.bodyFatPercentage}
            onValueChange={(value) => updateUserData('bodyFatPercentage', value)}
            onNotSurePress={() => setShowBodyFatModal(true)}
            min={5}
            max={50}
          />

          {/* Activity Level */}
          <ActivityLevelSelector
            selectedLevel={userData.activityLevel}
            onLevelChange={(level) => updateUserData('activityLevel', level)}
          />
        </View>

        {/* Bottom Spacing */}
        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="px-6 pb-6 bg-white border-t border-gray-100">
        <Button
          title="Next"
          variant={isFormValid ? "primary" : "secondary"}
          size="lg"
          onPress={handleNext}
          disabled={!isFormValid}
          className={`w-full ${!isFormValid ? 'opacity-50' : ''}`}
        />
      </View>

      {/* Body Fat Calculator Modal */}
      <BodyFatCalculatorModal
        visible={showBodyFatModal}
        onClose={() => setShowBodyFatModal(false)}
        onUseValue={handleUseCalculatedBodyFat}
      />
    </SafeAreaView>
  );
}
