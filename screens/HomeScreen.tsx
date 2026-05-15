import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Profile, AvailableSpace } from '../lib/types';
import { dummyAvailableSpaces } from '../lib/dummyData';

interface HomeScreenProps {
  route: { params: { userId: string; userType: 'popup' | 'host' } };
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const { userId, userType } = route.params;
  const [spaces] = useState<AvailableSpace[]>(dummyAvailableSpaces);
  const [loading] = useState(false);

  const formatAvailability = (space: AvailableSpace): string => {
    const days = space.availableTimes.map(slot => `${slot.day.slice(0, 3)}: ${slot.startTime}-${slot.endTime}`);
    return days.slice(0, 2).join(', ') + (days.length > 2 ? '...' : '');
  };

  const renderSpace = ({ item }: { item: AvailableSpace }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('SpaceDetail', { space: item })}>
      <View style={styles.spaceTitleRow}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.cost}>${item.costPerHour}/hr</Text>
      </View>
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      <View style={styles.detailsRow}>
        <Text style={styles.detail}>📍 Max: {item.maxOccupancy}</Text>
        <Text style={styles.detail}>🕐 {formatAvailability(item)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyPopup = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Currently no spaces available</Text>
    </View>
  );

  const renderHostPage = () => (
    <View style={styles.pageBeingBuiltContainer}>
      <Text style={styles.pageBeingBuiltText}>Page being built</Text>
    </View>
  );

  const renderPopupContent = () => {
    if (loading) {
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (spaces.length === 0) {
      return renderEmptyPopup();
    }

    return (
      <FlatList
        data={spaces}
        renderItem={renderSpace}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {userType === 'popup' ? 'Available Spaces' : 'Your Dashboard'}
      </Text>
      {userType === 'popup' ? renderPopupContent() : renderHostPage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#1a1a1a' },
  item: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  spaceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  cost: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  description: { fontSize: 14, color: '#666666', marginBottom: 8 },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detail: { fontSize: 13, color: '#555555', fontWeight: '500' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '500',
  },
  pageBeingBuiltContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageBeingBuiltText: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'center',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;