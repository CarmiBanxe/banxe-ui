import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MobileDashboard } from './src/screens/MobileDashboard'
import { MobileWallet } from './src/screens/MobileWallet'
import { Text } from 'react-native'

const Tab = createBottomTabNavigator()

const BANXE_DARK = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0D1B2A',
    card: '#1B2838',
    text: '#F8FAFC',
    primary: '#2563EB',
    border: '#334155',
  },
}

const ICON: Record<string, string> = {
  Dashboard: '⌂',
  Wallets: '◈',
  Transactions: '≡',
  AI: '✦',
  Profile: '⚙',
}

function TabIcon({ name }: { name: string }) {
  return <Text style={{ fontSize: 20, color: '#F8FAFC' }}>{ICON[name] ?? '•'}</Text>
}

export default function App(): React.ReactElement {
  return (
    <NavigationContainer theme={BANXE_DARK}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => <TabIcon name={route.name} />,
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: { backgroundColor: '#1B2838', borderTopColor: '#334155' },
          headerStyle: { backgroundColor: '#0D1B2A' },
          headerTintColor: '#F8FAFC',
        })}
      >
        <Tab.Screen name="Dashboard" component={MobileDashboard} />
        <Tab.Screen name="Wallets" component={MobileWallet} />
        <Tab.Screen name="Transactions" component={MobileDashboard} />
        <Tab.Screen name="AI" component={MobileDashboard} />
        <Tab.Screen name="Profile" component={MobileDashboard} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
