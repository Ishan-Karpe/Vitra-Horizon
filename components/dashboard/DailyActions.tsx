import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDashboardContext } from '../../contexts/DashboardContext';

interface ActionItemProps {
  id: string;
  title: string;
  completed: boolean;
  icon: string;
  onToggle: (id: string) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ id, title, completed, icon, onToggle }) => {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(id);
  };

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-100 last:border-b-0"
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Custom Checkbox */}
      <View className={`w-6 h-6 rounded border-2 mr-4 items-center justify-center ${
        completed 
          ? 'bg-green-500 border-green-500' 
          : 'border-gray-300 bg-white'
      }`}>
        {completed && (
          <Text className="text-white text-xs font-bold">✓</Text>
        )}
      </View>

      {/* Action Icon */}
      <Text className="text-lg mr-3">{icon}</Text>

      {/* Action Text */}
      <View className="flex-1">
        <Text className={`text-gray-700 ${
          completed ? 'line-through opacity-60' : ''
        }`}>
          {title}
        </Text>
        {completed && (
          <Text className="text-green-600 text-xs mt-1 font-medium">
            ✓ Completed today
          </Text>
        )}
      </View>

      {/* Completion Indicator */}
      {completed ? (
        <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center ml-2">
          <Text className="text-white text-sm font-bold">✓</Text>
        </View>
      ) : (
        <View className="w-8 h-8 border-2 border-gray-300 rounded-full items-center justify-center ml-2">
          <View className="w-3 h-3 bg-gray-300 rounded-full" />
        </View>
      )}
    </TouchableOpacity>
  );
};

interface DailyActionsProps {
  className?: string;
}

export const DailyActions: React.FC<DailyActionsProps> = ({ className = '' }) => {
  const { dailyActions, toggleAction } = useDashboardContext();

  return (
    <View className={className}>
      {/* Section Title */}
      <Text className="text-lg font-semibold text-gray-900 px-6 mb-4">
        Today's Actions
      </Text>

      {/* Actions Container */}
      <View className="bg-white rounded-lg shadow-sm mx-6">
        {dailyActions.map((action) => (
          <ActionItem
            key={action.id}
            id={action.id}
            title={action.title}
            completed={action.completed}
            icon={action.icon}
            onToggle={toggleAction}
          />
        ))}
      </View>
    </View>
  );
};
