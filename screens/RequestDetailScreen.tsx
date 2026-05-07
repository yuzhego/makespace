import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { Request } from '../lib/types';

interface RequestDetailScreenProps {
  route: { params: { request: Request } };
  navigation: any;
}

const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({ route, navigation }) => {
  const { request } = route.params;
  const [notes, setNotes] = useState('');

  const handleResponse = async (status: 'approved' | 'declined') => {
    try {
      const { error } = await supabase.from('requests').update({
        status,
        response_notes: notes,
      }).eq('id', request.id);
      if (error) throw error;
      Alert.alert('Success', `Request ${status}`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collaboration Request</Text>
      <Text>Date: {request.requested_date}</Text>
      <Text>Time: {request.requested_time}</Text>
      <Text>Message: {request.message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional response notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <View style={styles.buttons}>
        <Button title="Approve" onPress={() => handleResponse('approved')} />
        <Button title="Decline" onPress={() => handleResponse('declined')} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5, height: 100 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around' },
});

export default RequestDetailScreen;