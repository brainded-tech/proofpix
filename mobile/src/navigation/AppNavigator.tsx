/**
 * ProofPix Mobile App Navigator
 * Main navigation structure with authentication flow and tab navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import CameraScreen from '../screens/main/CameraScreen';
import FilesScreen from '../screens/main/FilesScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Detail Screens
import FileDetailScreen from '../screens/details/FileDetailScreen';
import ProcessingStatusScreen from '../screens/details/ProcessingStatusScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SecurityScreen from '../screens/settings/SecurityScreen';
import OfflineScreen from '../screens/settings/OfflineScreen';

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  FileDetail: { fileId: string };
  ProcessingStatus: { fileId: string };
  Settings: undefined;
  Security: undefined;
  Offline: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Camera: undefined;
  Files: undefined;
  Analytics: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

// Auth Navigator
const AuthNavigator = () => {
  const { colors } = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Camera':
              iconName = 'camera-alt';
              break;
            case 'Files':
              iconName = 'folder';
              break;
            case 'Analytics':
              iconName = 'analytics';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{ title: 'Capture' }}
      />
      <Tab.Screen 
        name="Files" 
        component={FilesScreen}
        options={{ title: 'My Files' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Insights' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator (for additional screens)
const DrawerNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.surface,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ 
          title: 'ProofPix',
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Security" 
        component={SecurityScreen}
        options={{ 
          title: 'Security',
          drawerIcon: ({ color, size }) => (
            <Icon name="security" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Offline" 
        component={OfflineScreen}
        options={{ 
          title: 'Offline Files',
          drawerIcon: ({ color, size }) => (
            <Icon name="cloud-off" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { colors } = useTheme();

  if (isLoading) {
    // Show splash screen or loading indicator
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={DrawerNavigator} />
            <Stack.Screen 
              name="FileDetail" 
              component={FileDetailScreen}
              options={{ 
                headerShown: true,
                title: 'File Details',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen 
              name="ProcessingStatus" 
              component={ProcessingStatusScreen}
              options={{ 
                headerShown: true,
                title: 'Processing Status',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 