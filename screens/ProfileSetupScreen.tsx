import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AvailabilitySlot } from '../lib/types';

interface ProfileSetupScreenProps {
  route?: { params: { userId: string } };
  navigation: any;
  onComplete: (type: 'popup' | 'host') => void;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ route, navigation, onComplete }) => {
  const { userId } = route?.params || {};
  const [userType, setUserType] = useState<'popup' | 'host'>('popup');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [spacePhotos, setSpacePhotos] = useState('');
  const [pricing, setPricing] = useState('');
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  const addAvailabilitySlot = () => {
    setAvailability([...availability, { date: '', start_time: '', end_time: '' }]);
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: string) => {
    const newSlots = [...availability];
    newSlots[index][field] = value;
    setAvailability(newSlots);
  };

  const handleSubmit = () => {
    if (!businessName.trim()) {
      Alert.alert('Error', 'Please enter a business name');
      return;
    }

    Alert.alert('Success', 'Profile setup complete!');
    onComplete(userType);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>
      <Text style={styles.label}>I am a:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={userType} onValueChange={(value) => setUserType(value)}>
          <Picker.Item label="Pop-up Business Owner" value="popup" />
          <Picker.Item label="Space Host" value="host" />
        </Picker>
      </View>
      <Text style={styles.label}>Business Name</Text>
      <TextInput style={styles.input} placeholder="Business Name" value={businessName} onChangeText={setBusinessName} />
      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.largeInput]} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <Text style={styles.label}>Photos URLs (optional)</Text>
      <TextInput style={styles.input} placeholder="Photos (comma separated URLs)" value={photos} onChangeText={setPhotos} />

      {userType === 'host' && (
        <>
          <Text style={styles.label}>Space Description</Text>
          <TextInput style={[styles.input, styles.largeInput]} placeholder="Space Description" value={spaceDescription} onChangeText={setSpaceDescription} multiline />
          <Text style={styles.label}>Space Photos URLs (optional)</Text>
          <TextInput style={styles.input} placeholder="Space Photos (comma separated URLs)" value={spacePhotos} onChangeText={setSpacePhotos} />
          <Text style={styles.label}>Pricing Info</Text>
          <TextInput style={styles.input} placeholder="Pricing" value={pricing} onChangeText={setPricing} />

          <Text style={styles.label}>Availability</Text>
          {availability.map((slot, index) => (
            <View key={index} style={styles.slot}>
              <TextInput placeholder="Date (YYYY-MM-DD)" value={slot.date} onChangeText={(v) => updateSlot(index, 'date', v)} style={styles.slotInput} />
              <TextInput placeholder="Start Time (HH:MM)" value={slot.start_time} onChangeText={(v) => updateSlot(index, 'start_time', v)} style={styles.slotInput} />
              <TextInput placeholder="End Time (HH:MM)" value={slot.end_time} onChangeText={(v) => updateSlot(index, 'end_time', v)} style={styles.slotInput} />
            </View>
          ))}
          <Button title="Add Availability Slot" onPress={addAvailabilitySlot} />
          <View style={{ height: 10 }} />
        </>
      )}

      <Button title="Complete Setup" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', marginTop: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, padding: 12, marginBottom: 20, borderRadius: 8, borderColor: '#ddd' },
  largeInput: { height: 100 },
  pickerContainer: { borderWidth: 1, borderRadius: 8, borderColor: '#ddd', marginBottom: 20 },
  slot: { marginBottom: 15 },
  slotInput: { borderWidth: 1, padding: 10, marginBottom: 8, borderRadius: 5, borderColor: '#ddd' },
});

export default ProfileSetupScreen;