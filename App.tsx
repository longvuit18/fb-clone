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
import axios from 'axios';
import { BASE_URL } from "./constants";
import UploadPost from './components/UploadPost';
import PostComment from './components/PostComment';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();


const HomeTab = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="UploadPost" component={UploadPost}/>
      <Stack.Screen name="PostComment" component={PostComment}/>
    </Stack.Navigator>
  );
}

const BottomNavbar = () => {
  const navigationOptions = {
    showIcon: true,
    showLabel: false,
  }
  return (
    <Tab.Navigator >
      <Tab.Screen options={{ tabBarIcon: ({ color, focused }) => (<Icon name='home' size={20} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Home" component={HomeTab} />
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

axios.defaults.baseURL = BASE_URL;
axios.defaults.params = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOWNiMWFhNjBiY2Q5OTMzY2UzZGZmNyIsImRhdGVMb2dpbiI6IjIwMjItMTItMjBUMTU6MDE6NTguMDkyWiIsImlhdCI6MTY3MTU0ODUxOCwiZXhwIjoxNjgxNTQ4NTE3fQ.Yw4B1jJcrZ6ZsgtJztwPQPLFg6QLJP9Ljc8PHPytIXA"
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
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

