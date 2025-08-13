import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface GoalCardProps {
  id: string;
  title: string;
  icon: string;
  color: "orange" | "green" | "blue";
  isSelected: boolean;
  onPress: (id: string) => void;
  className?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  id,
  title,
  icon,
  color,
  isSelected,
  onPress,
  className = "",
}) => {
  const getColorClasses = () => {
    const baseClasses =
      "flex-1 p-4 rounded-xl border-2 transition-all duration-200";

    switch (color) {
      case "orange":
        return isSelected
          ? `${baseClasses} border-orange-500 bg-orange-50`
          : `${baseClasses} border-gray-200 bg-gray-50 hover:border-orange-300`;
      case "green":
        return isSelected
          ? `${baseClasses} border-green-500 bg-green-50`
          : `${baseClasses} border-gray-200 bg-gray-50 hover:border-green-300`;
      case "blue":
        return isSelected
          ? `${baseClasses} border-blue-500 bg-blue-50`
          : `${baseClasses} border-gray-200 bg-gray-50 hover:border-blue-300`;
      default:
        return `${baseClasses} border-gray-200 bg-gray-50`;
    }
  };

  const getShadowStyle = () => {
    if (!isSelected) return {};

    return {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4, // For Android
    };
  };

  const getIconBackgroundColor = () => {
    switch (color) {
      case "orange":
        return "bg-orange-500";
      case "green":
        return "bg-green-500";
      case "blue":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <TouchableOpacity
      className={`${getColorClasses()} ${className}`}
      style={getShadowStyle()}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <View className="items-center">
        {/* Icon Container */}
        <View
          className={`w-12 h-12 ${getIconBackgroundColor()} rounded-full items-center justify-center mb-3 ${isSelected ? "scale-110" : ""} transition-transform duration-200`}
        >
          <Text className="text-white text-xl">{icon}</Text>
        </View>

        {/* Title */}
        <Text
          className={`text-gray-900 font-semibold text-center ${title.length > 12 ? "text-xs" : "text-sm"}`}
        >
          {title}
        </Text>

        {/* Selection Indicator */}
        {isSelected && (
          <View className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
