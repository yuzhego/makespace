import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import HostDetailScreen from './screens/HostDetailScreen';
import RequestFormScreen from './screens/RequestFormScreen';
import RequestDetailScreen from './screens/RequestDetailScreen';
import AuthScreen from './screens/AuthScreen';
import { supabase } from './lib/supabase';

type RootStackParamList = {
  Auth: undefined;
  Home: { userId: string; userType: 'popup' | 'host' };
  HostDetail: { host: any; popupId?: string };
  RequestForm: { hostId: string; popupId: string };
  RequestDetail: { request: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userType] = useState<'popup' | 'host'>('popup');

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUserId = data.session?.user?.id || null;
      setUserId(currentUserId);
    };

    loadSession();
  }, []);

  if (!userId) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth">
            {() => <AuthScreen onAuthSuccess={setUserId} />}
          </Stack.Screen>
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ userId, userType }}
        />
        <Stack.Screen
          name="HostDetail"
          component={HostDetailScreen}
          options={{ headerShown: true, title: 'Host Details' }}
        />
        <Stack.Screen
          name="RequestForm"
          component={RequestFormScreen}
          options={{ headerShown: true, title: 'Send Request' }}
        />
        <Stack.Screen
          name="RequestDetail"
          component={RequestDetailScreen}
          options={{ headerShown: true, title: 'Review Request' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
