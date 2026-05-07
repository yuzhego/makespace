import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Profile } from '../lib/types';

interface HomeScreenProps {
  route: { params: { userId: string; userType: 'popup' | 'host' } };
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const { userId, userType } = route.params;
  const [hosts] = useState<Profile[]>([]);
  const [loading] = useState(false);

  const renderHost = ({ item }: { item: Profile }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('HostDetail', { host: item, popupId: userId })}>
      <Text style={styles.title}>{item.business_name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderEmptyPopup = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Currently no space hosts available</Text>
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

    if (hosts.length === 0) {
      return renderEmptyPopup();
    }

    return (
      <FlatList
        data={hosts}
        renderItem={renderHost}
        keyExtractor={(item) => item.user_id}
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
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  description: { fontSize: 14, color: '#666666' },
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