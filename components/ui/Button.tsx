import * as Haptics from "expo-haptics";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

export interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  className?: string;
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  onPress,
  className = "",
  ...props
}: ButtonProps) {
  const handlePress = () => {
    // Add haptic feedback
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(
        variant === "primary"
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light,
      );
    }
    onPress?.();
  };

  // Base button styles
  const baseStyles =
    "rounded-lg font-semibold text-center transition-colors duration-200";

  // Size variants
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-lg",
    lg: "px-8 py-5 text-xl",
  };

  // Color variants (Mobile-optimized)
  const variantStyles = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-600 text-white",
    outline: "bg-transparent border-2 border-blue-600 text-blue-600",
    ghost: "bg-transparent text-gray-700",
  };

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  const textClasses =
    variant === "primary" || variant === "secondary"
      ? "text-white"
      : variant === "outline"
        ? "text-blue-600"
        : "text-gray-700";

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={handlePress}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={`${textClasses} font-semibold text-center`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
