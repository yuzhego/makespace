import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';
import { AvailabilitySlot } from '../lib/types';

interface RequestFormScreenProps {
  route: { params: { hostId: string; popupId: string } };
  navigation: any;
}

const RequestFormScreen: React.FC<RequestFormScreenProps> = ({ route, navigation }) => {
  const { hostId, popupId } = route.params;
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const { data, error } = await supabase.from('profiles').select('availability').eq('user_id', hostId).single();
    if (error) console.error(error);
    else setSlots(data.availability || []);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    const slot = slots.find(s => `${s.date} ${s.start_time}-${s.end_time}` === selectedSlot);
    if (!slot) return;

    try {
      const { error } = await supabase.from('requests').insert({
        popup_id: popupId,
        host_id: hostId,
        requested_date: slot.date,
        requested_time: `${slot.start_time}-${slot.end_time}`,
        message,
        status: 'pending',
      });
      if (error) throw error;
      Alert.alert('Success', 'Request sent!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Collaboration</Text>
      <Text>Select Time Slot</Text>
      <Picker selectedValue={selectedSlot} onValueChange={setSelectedSlot}>
        <Picker.Item label="Select a slot" value="" />
        {slots.map((slot, index) => (
          <Picker.Item key={index} label={`${slot.date} ${slot.start_time}-${slot.end_time}`} value={`${slot.date} ${slot.start_time}-${slot.end_time}`} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Optional message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Send Request" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, height: 100 },
});

export default RequestFormScreen;