import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';

export interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function Hero({ title, subtitle, children, className = '' }: HeroProps) {
  return (
    <View className={`items-center text-center px-2 sm:px-4 ${className}`}>
      {/* Main Title */}
      <Text className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center leading-tight">
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle && (
        <Text className="text-base sm:text-lg md:text-xl text-gray-600 text-center mt-3 sm:mt-4 md:mt-6 leading-relaxed max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl">
          {subtitle}
        </Text>
      )}

      {/* Additional Content */}
      {children && (
        <View className="mt-4 sm:mt-6 md:mt-8">
          {children}
        </View>
      )}
    </View>
  );
}
