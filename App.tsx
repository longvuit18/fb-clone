import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5'

import HomeScreen from './screens/Home';
import 'react-native-gesture-handler';
import NotificationScreen from './screens/Notification';
import { initData, StoreContext } from './store';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();


const BottomNavbar = () => {
  const navigationOptions = {
    showIcon: true,
    showLabel: false,
  }
  return (
    <Tab.Navigator>
      <Tab.Screen options={{ tabBarIcon: ({ color, focused }) => (<Icon name='home' size={20} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Home" component={HomeScreen} />
        <Tab.Screen
				options={{ tabBarIcon: ({ color, focused }) => (<Icon name='video' size={20} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
				name="Watch" component={HomeScreen} />
      <Tab.Screen
        options={{ tabBarIcon: ({ color, focused }) => (<Icon name='bell' size={22} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Notification" component={NotificationScreen} />
      <Tab.Screen
        options={{ tabBarIcon: ({ color, focused }) => (<Icon name='user-circle' size={22} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Profile" component={HomeScreen} />
    </Tab.Navigator>
  );

}
export default function App() {
  const TransitionPreset = Platform.OS === 'ios' ? TransitionPresets.ModalSlideFromBottomIOS : {}
  const navigationOptions = {
    headerShown: false,
    ...TransitionPreset,
  }
  return (
    <StoreContext.Provider value={initData}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={navigationOptions}>
          <RootStack.Screen name={"BottomNavbar"} component={BottomNavbar} />
        </RootStack.Navigator>
      </NavigationContainer>
    </StoreContext.Provider>
  );
}

