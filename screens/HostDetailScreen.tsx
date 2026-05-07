import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Profile } from '../lib/types';

interface HostDetailScreenProps {
  route: { params: { host: Profile; popupId?: string } };
  navigation: any;
}

const HostDetailScreen: React.FC<HostDetailScreenProps> = ({ route, navigation }) => {
  const { host, popupId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{host.business_name}</Text>
      <Text style={styles.description}>{host.description}</Text>
      {host.photos && host.photos.map((photo, index) => (
        <Text key={index}>Photo: {photo}</Text>
      ))}
      {host.space_description && (
        <>
          <Text style={styles.subtitle}>Space Details</Text>
          <Text>{host.space_description}</Text>
        </>
      )}
      {host.space_photos && host.space_photos.map((photo, index) => (
        <Text key={index}>Space Photo: {photo}</Text>
      ))}
      {host.pricing && <Text>Pricing: {host.pricing}</Text>}
      {host.availability && (
        <>
          <Text style={styles.subtitle}>Availability</Text>
          {host.availability.map((slot, index) => (
            <Text key={index}>{slot.date} {slot.start_time} - {slot.end_time}</Text>
          ))}
        </>
      )}
      <Button
        title="Request Collaboration"
        onPress={() => navigation.navigate('RequestForm', { hostId: host.user_id, popupId: popupId || '' })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
});

export default HostDetailScreen;