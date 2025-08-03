import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

export const FloatingActionButton: React.FC = () => {
  const router = useRouter();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/edit-scenario');
  };

  return (
    <TouchableOpacity
      className="absolute bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg items-center justify-center"
      onPress={handlePress}
      activeOpacity={0.8}
      style={{
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }}
    >
      <Text className="text-white text-2xl font-light">+</Text>
    </TouchableOpacity>
  );
};
