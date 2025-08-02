import React from 'react';
import { Text, View } from 'react-native';

export interface FeatureCardProps {
  emoji: string;
  title: string;
  description?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function FeatureCard({ 
  emoji, 
  title, 
  description,
  variant = 'default',
  className = '' 
}: FeatureCardProps) {
  const isCompact = variant === 'compact';
  
  return (
    <View className={`flex-row items-center ${isCompact ? 'space-x-4' : 'space-x-6 p-4 bg-white rounded-xl border border-gray-100'} ${className}`}>
      {/* Emoji Icon */}
      <View className={`${isCompact ? 'w-12 h-12 bg-blue-50' : 'w-16 h-16 bg-blue-50'} rounded-full items-center justify-center`}>
        <Text className={`${isCompact ? 'text-2xl' : 'text-3xl'}`}>
          {emoji}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className={`${isCompact ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 leading-tight`}>
          {title}
        </Text>
        {description && (
          <Text className="text-sm text-gray-600 mt-1 leading-relaxed">
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}
