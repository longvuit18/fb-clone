import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useEffect, useReducer, useState } from "react";

import HomeScreen from './screens/Home';
import 'react-native-gesture-handler';
import NotificationScreen from './screens/Setting';
import { getData, getDataObject, initData, reducer, StoreContext, useStore } from './store';
import axios from 'axios';
import { BASE_URL } from "./constants";
import UploadPost from './components/UploadPost';
import PostComment from './components/PostComment';
import Login from './screens/Login';
import { View, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Setting from './screens/Setting';
import Register from './screens/Register';
import Verify from './screens/Verify';

import Profile from './screens/ProfileTab';
import EditPublicInfo from './screens/ProfileTab/EditPublicInfo';
import Search from './screens/Search'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();


const HomeTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewsFeed" component={HomeScreen} />
      <Stack.Screen name="UploadPost" component={UploadPost} />
      <Stack.Screen name="PostComment" component={PostComment} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
}

const ProfileTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditPublicInfo" component={EditPublicInfo} />
    </Stack.Navigator>
  );
}

const BottomNavbar = () => {
  const navigationOptions = {
    showIcon: true,
    showLabel: false,
  }
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false
    }}>
      <Tab.Screen options={{ tabBarIcon: ({ color, focused }) => (<Icon name='home' size={20} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Home" component={HomeTab} />
      <Tab.Screen
        options={{ tabBarIcon: ({ color, focused }) => (<Icon name='video' size={20} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Watch" component={HomeScreen} />
      <Tab.Screen
        options={{ tabBarIcon: ({ color, focused }) => (<Icon name='cog' size={22} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Setting" component={Setting} />
      <Tab.Screen
        options={{ tabBarIcon: ({ color, focused }) => (<Icon name='user-circle' size={22} color={focused ? '#318bfb' : '#ddd'}></Icon>) }}
        name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );

}

const AuthNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Verify" component={Verify} />
    </Stack.Navigator>
  );
}

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Access-Control-Allow-Headers'] = '*';
export default function App() {
  const [init, setInit] = useState(true);
  const [state, dispatch] = useReducer(reducer, initData);

  // const TransitionPreset = Platform.OS === 'ios' ? TransitionPresets.ModalSlideFromBottomIOS : {}
  const navigationOptions = {
    headerShown: false,
    // ...TransitionPreset,
  }
  useEffect(() => {
    getData("token").then(token => {
      getDataObject("user").then(user => {
        dispatch({
          type: "LOAD_INIT_DATA", payload: {
            token: token,
            user
          }
        });
        setInit(false);
      }).catch(() => {
        setInit(false);
      })
    }).catch(() => {
      setInit(false);
    })

  }, [])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {init ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ marginBottom: 20 }}
          source={require("./assets/facebookLogo.png")}
        />
        <ActivityIndicator color='#000' />
      </View>
        :
        (!state.isLogin ? (
          <NavigationContainer>
            <AuthNav />
          </NavigationContainer>
        ) :
          <NavigationContainer>
            <RootStack.Navigator screenOptions={navigationOptions}>
              <RootStack.Screen name={"BottomNavbar"} component={BottomNavbar} />
            </RootStack.Navigator>
          </NavigationContainer>
        )
      }
    </StoreContext.Provider>
  );
}

