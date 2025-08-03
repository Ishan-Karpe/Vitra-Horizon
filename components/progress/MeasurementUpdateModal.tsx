import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useProgress } from '../../contexts/ProgressContext';

interface MeasurementUpdateModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MeasurementUpdateModal: React.FC<MeasurementUpdateModalProps> = ({
  visible,
  onClose,
}) => {
  const { measurements, updateMeasurements } = useProgress();
  
  const [chest, setChest] = useState(measurements.chest.toString());
  const [waist, setWaist] = useState(measurements.waist.toString());
  const [hips, setHips] = useState(measurements.hips.toString());
  const [arms, setArms] = useState(measurements.arms.toString());

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Validate inputs
    const chestNum = parseFloat(chest);
    const waistNum = parseFloat(waist);
    const hipsNum = parseFloat(hips);
    const armsNum = parseFloat(arms);

    if (isNaN(chestNum) || isNaN(waistNum) || isNaN(hipsNum) || isNaN(armsNum)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for all measurements.');
      return;
    }

    // Calculate changes
    const chestChange = chestNum - measurements.chest;
    const waistChange = waistNum - measurements.waist;
    const hipsChange = hipsNum - measurements.hips;
    const armsChange = armsNum - measurements.arms;

    // Update measurements
    updateMeasurements({
      chest: chestNum,
      waist: waistNum,
      hips: hipsNum,
      arms: armsNum,
      chestChange,
      waistChange,
      hipsChange,
      armsChange,
    });

    Alert.alert('Success', 'Measurements updated successfully!');
    onClose();
  };

  const handleCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
              Update Measurements
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-2">Chest (inches)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={chest}
                  onChangeText={setChest}
                  keyboardType="numeric"
                  placeholder="Enter chest measurement"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Waist (inches)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={waist}
                  onChangeText={setWaist}
                  keyboardType="numeric"
                  placeholder="Enter waist measurement"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Hips (inches)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={hips}
                  onChangeText={setHips}
                  keyboardType="numeric"
                  placeholder="Enter hips measurement"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Arms (inches)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={arms}
                  onChangeText={setArms}
                  keyboardType="numeric"
                  placeholder="Enter arms measurement"
                />
              </View>
            </View>

            <View className="flex-row space-x-4 mt-6">
              <TouchableOpacity
                className="flex-1 bg-gray-200 py-3 rounded-lg"
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 text-center font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 py-3 rounded-lg"
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Text className="text-white text-center font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
