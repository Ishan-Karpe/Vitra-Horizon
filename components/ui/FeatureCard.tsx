import React from "react";
import { Text, View } from "react-native";

export interface FeatureCardProps {
  emoji: string;
  title: string;
  description?: string;
  variant?: "default" | "compact";
  className?: string;
}

export function FeatureCard({
  emoji,
  title,
  description,
  variant = "default",
  className = "",
}: FeatureCardProps) {
  const isCompact = variant === "compact";

  return (
    <View
      className={`flex-row items-center ${isCompact ? "space-x-3 sm:space-x-4 md:space-x-5" : "space-x-4 sm:space-x-6 p-4 sm:p-5 md:p-6 bg-white rounded-xl border border-gray-100 shadow-sm"} ${className}`}
    >
      {/* Emoji Icon */}
      <View
        className={`${isCompact ? "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-50" : "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-blue-50"} rounded-full items-center justify-center flex-shrink-0`}
      >
        <Text
          className={`${isCompact ? "text-xl sm:text-2xl md:text-3xl" : "text-2xl sm:text-3xl md:text-4xl"}`}
        >
          {emoji}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 min-w-0">
        <Text
          className={`${isCompact ? "text-base sm:text-lg md:text-xl" : "text-lg sm:text-xl md:text-2xl"} font-semibold text-gray-900 leading-tight`}
        >
          {title}
        </Text>
        {description && (
          <Text className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 leading-relaxed">
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}
