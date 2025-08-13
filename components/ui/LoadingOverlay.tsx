import React from "react";
import { View, Text, ActivityIndicator, Modal } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  progress?: number;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Loading...",
  progress,
  className = "",
}) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View
          className={`bg-white rounded-2xl p-8 mx-8 items-center ${className}`}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {/* Spinner */}
          <ActivityIndicator size="large" color="#2563eb" className="mb-4" />

          {/* Message */}
          <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
            {message}
          </Text>

          {/* Progress Bar */}
          {progress !== undefined && (
            <View className="w-full mt-4">
              <View className="w-full h-2 bg-gray-200 rounded-full">
                <View
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </View>
              <Text className="text-sm text-gray-500 text-center mt-2">
                {Math.round(progress)}%
              </Text>
            </View>
          )}

          {/* Subtitle */}
          <Text className="text-sm text-gray-500 text-center mt-2">
            This may take a few moments...
          </Text>
        </View>
      </View>
    </Modal>
  );
};
