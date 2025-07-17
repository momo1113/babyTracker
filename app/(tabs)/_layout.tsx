import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000', // active text & icon color set to black
        tabBarInactiveTintColor: '#687076', // optional: inactive color for contrast
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
  <Tabs.Screen
    name="home"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="house.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="history"
    options={{
      title: 'History',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="calendar" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="insights"
    options={{
      title: 'Insights',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="chart.bar.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="profile"
    options={{
      title: 'Profile',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="person.fill" color={color} />
      ),
    }}
  />
</Tabs>

  );
}
