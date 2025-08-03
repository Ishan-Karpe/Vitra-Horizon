import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useProgress } from '../../contexts/ProgressContext';
import { MeasurementUpdateModal } from './MeasurementUpdateModal';

interface MeasurementRowProps {
  label: string;
  value: number;
  change: number;
  unit: string;
}

const MeasurementRow: React.FC<MeasurementRowProps> = ({ label, value, change, unit }) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600'; // Increase (usually not good for measurements)
    if (change < 0) return 'text-green-600'; // Decrease (usually good)
    return 'text-gray-600'; // No change
  };

  const getChangePrefix = (change: number) => {
    if (change > 0) return '+';
    if (change < 0) return '';
    return '';
  };

  return (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <Text className="text-gray-700 font-medium">{label}</Text>
      <View className="flex-row items-center">
        <Text className="text-gray-900 font-semibold mr-2">
          {value} {unit}
        </Text>
        {change !== 0 && (
          <Text className={`text-sm ${getChangeColor(change)}`}>
            {getChangePrefix(change)}{Math.abs(change)}
          </Text>
        )}
      </View>
    </View>
  );
};

export const MeasurementsSection: React.FC = () => {
  const { measurements } = useProgress();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleUpdatePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowUpdateModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
  };

  return (
    <>
      <View className="bg-white rounded-lg shadow-sm mx-6 mb-4 p-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Measurements</Text>
        
        <View>
          <MeasurementRow
            label="Chest"
            value={measurements.chest}
            change={measurements.chestChange}
            unit="in"
          />
          <MeasurementRow
            label="Waist"
            value={measurements.waist}
            change={measurements.waistChange}
            unit="in"
          />
          <MeasurementRow
            label="Hips"
            value={measurements.hips}
            change={measurements.hipsChange}
            unit="in"
          />
          <MeasurementRow
            label="Arms"
            value={measurements.arms}
            change={measurements.armsChange}
            unit="in"
          />
        </View>

        <TouchableOpacity
          className="mt-4 py-2"
          onPress={handleUpdatePress}
          activeOpacity={0.7}
        >
          <Text className="text-blue-600 text-center font-medium">
            Update Measurements
          </Text>
        </TouchableOpacity>
      </View>

      <MeasurementUpdateModal
        visible={showUpdateModal}
        onClose={handleCloseModal}
      />
    </>
  );
};
