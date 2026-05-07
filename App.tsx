import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import HomeScreen from './screens/HomeScreen';
import HostDetailScreen from './screens/HostDetailScreen';
import RequestFormScreen from './screens/RequestFormScreen';
import RequestDetailScreen from './screens/RequestDetailScreen';

type RootStackParamList = {
  ProfileSetup: { userId: string };
  Home: { userId: string; userType: 'popup' | 'host' };
  HostDetail: { host: any; popupId?: string };
  RequestForm: { hostId: string; popupId: string };
  RequestDetail: { request: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const DEFAULT_USER_ID = 'demo-user-123';

export default function App() {
  const [userId] = useState<string>(DEFAULT_USER_ID);
  const [userType, setUserType] = useState<'popup' | 'host' | null>(null);
  const [isProfileSetup, setIsProfileSetup] = useState(false);

  /**
   * Handle profile setup completion
   * Called from ProfileSetupScreen when user finishes setup
   */
  const handleProfileComplete = useCallback((type: 'popup' | 'host') => {
    console.log(`Profile setup completed: ${type}`);
    setUserType(type);
    setIsProfileSetup(true);
  }, []);

  return (
    <NavigationContainer>
      {isProfileSetup && userType ? (
        // User has completed profile setup - show Home and detail screens
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            initialParams={{ userId, userType }}
            options={{ animationEnabled: false }}
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
      ) : (
        // User needs to complete profile setup
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfileSetup" options={{ animationEnabled: false }}>
            {(props) => (
              <ProfileSetupScreen {...props} onComplete={handleProfileComplete} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
