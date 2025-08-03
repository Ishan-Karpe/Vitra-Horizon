import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface BodyFatCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  onUseValue: (bodyFatPercentage: number) => void;
}

export const BodyFatCalculatorModal: React.FC<BodyFatCalculatorModalProps> = ({
  visible,
  onClose,
  onUseValue,
}) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hips, setHips] = useState('');

  // Navy Method Body Fat Calculation
  const calculateBodyFat = (): number | null => {
    const heightNum = parseFloat(height);
    const waistNum = parseFloat(waist);
    const neckNum = parseFloat(neck);
    const hipsNum = parseFloat(hips);

    if (isNaN(heightNum) || isNaN(waistNum) || isNaN(neckNum)) return null;
    if (gender === 'female' && isNaN(hipsNum)) return null;

    let bodyFat: number;

    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistNum - neckNum) + 0.15456 * Math.log10(heightNum)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistNum + hipsNum - neckNum) + 0.22100 * Math.log10(heightNum)) - 450;
    }

    return Math.max(0, Math.min(50, bodyFat));
  };

  const result = calculateBodyFat();

  const handleUseValue = () => {
    if (result !== null) {
      onUseValue(Math.round(result * 10) / 10);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>Body Fat Calculator</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                    👨 Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                    👩 Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Age (years)</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="25"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Height (inches)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="70"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="180"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Waist (inches)</Text>
              <Text style={styles.hint}>Measure at the narrowest point</Text>
              <TextInput
                style={styles.input}
                value={waist}
                onChangeText={setWaist}
                keyboardType="numeric"
                placeholder="32"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Neck (inches)</Text>
              <Text style={styles.hint}>Below Adam's apple</Text>
              <TextInput
                style={styles.input}
                value={neck}
                onChangeText={setNeck}
                keyboardType="numeric"
                placeholder="15"
              />
            </View>

            {gender === 'female' && (
              <View style={styles.section}>
                <Text style={styles.label}>Hips (inches)</Text>
                <Text style={styles.hint}>Measure at the widest point</Text>
                <TextInput
                  style={styles.input}
                  value={hips}
                  onChangeText={setHips}
                  keyboardType="numeric"
                  placeholder="38"
                />
              </View>
            )}

            {/* Results */}
            {result !== null && (
              <View style={styles.resultSection}>
                <Text style={styles.resultTitle}>Result</Text>
                <Text style={styles.resultValue}>{result.toFixed(1)}%</Text>
                <Text style={styles.resultMethod}>Navy Method</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.useButton, !result && styles.useButtonDisabled]}
                onPress={handleUseValue}
                disabled={!result}
              >
                <Text style={[styles.useText, !result && styles.useTextDisabled]}>
                  Use This Value
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: '#9ca3af',
  },
  section: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  genderTextActive: {
    color: '#2563eb',
  },
  resultSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  resultMethod: {
    fontSize: 12,
    color: '#1e40af',
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  useButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  useButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  useText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  useTextDisabled: {
    color: '#6b7280',
  },
});
