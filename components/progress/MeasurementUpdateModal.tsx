import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
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

  const [weight, setWeight] = useState((measurements.weight || 0).toString());
  const [bodyFat, setBodyFat] = useState((measurements.bodyFatPercentage || 0).toString());
  const [chest, setChest] = useState(measurements.chest.toString());
  const [waist, setWaist] = useState(measurements.waist.toString());
  const [hips, setHips] = useState(measurements.hips.toString());
  const [arms, setArms] = useState(measurements.arms.toString());

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validate inputs
    const weightNum = parseFloat(weight);
    const bodyFatNum = parseFloat(bodyFat);
    const chestNum = parseFloat(chest);
    const waistNum = parseFloat(waist);
    const hipsNum = parseFloat(hips);
    const armsNum = parseFloat(arms);

    if (isNaN(weightNum) || isNaN(bodyFatNum) || isNaN(chestNum) || isNaN(waistNum) || isNaN(hipsNum) || isNaN(armsNum)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for all measurements.');
      return;
    }

    // Additional validation for reasonable ranges
    if (weightNum < 50 || weightNum > 500) {
      Alert.alert('Invalid Weight', 'Please enter a weight between 50 and 500 lbs.');
      return;
    }

    if (bodyFatNum < 5 || bodyFatNum > 50) {
      Alert.alert('Invalid Body Fat', 'Please enter a body fat percentage between 5% and 50%.');
      return;
    }

    // Calculate changes
    const weightChange = weightNum - (measurements.weight || 0);
    const bodyFatChange = bodyFatNum - (measurements.bodyFatPercentage || 0);
    const chestChange = chestNum - measurements.chest;
    const waistChange = waistNum - measurements.waist;
    const hipsChange = hipsNum - measurements.hips;
    const armsChange = armsNum - measurements.arms;

    // Update measurements (this will propagate to UserDataContext)
    updateMeasurements({
      weight: weightNum,
      bodyFatPercentage: bodyFatNum,
      chest: chestNum,
      waist: waistNum,
      hips: hipsNum,
      arms: armsNum,
      weightChange,
      bodyFatChange,
      chestChange,
      waistChange,
      hipsChange,
      armsChange,
    });

    Alert.alert('Success', 'All measurements updated successfully! Your goals and progress have been automatically updated.');
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
                <Text className="text-gray-700 font-medium mb-2">Weight (lbs)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="Enter current weight"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Body Fat (%)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={bodyFat}
                  onChangeText={setBodyFat}
                  keyboardType="numeric"
                  placeholder="Enter body fat percentage"
                />
              </View>

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
