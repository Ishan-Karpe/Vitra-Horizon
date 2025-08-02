import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

export interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function Hero({ title, subtitle, children, className = '' }: HeroProps) {
  return (
    <View className={`items-center text-center ${className}`}>
      {/* Main Title */}
      <Text className="text-4xl md:text-5xl font-bold text-gray-900 text-center leading-tight">
        {title}
      </Text>
      
      {/* Subtitle */}
      {subtitle && (
        <Text className="text-lg text-gray-600 text-center mt-4 leading-relaxed max-w-2xl">
          {subtitle}
        </Text>
      )}
      
      {/* Additional Content */}
      {children && (
        <View className="mt-6">
          {children}
        </View>
      )}
    </View>
  );
}
