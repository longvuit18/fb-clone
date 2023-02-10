import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
    console.log(e);

  }
}

export const storeDataObject = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // saving error
    console.log(e);

  }
}

export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
    return null;
  } catch (e) {
    // error reading value
    return null;
  }
}

export const clearDataStore = async () => {
  await AsyncStorage.clear();
}

export const removeDataStore = async (key: string) => {
  try {
      await AsyncStorage.removeItem(key);
      return true;
  }
  catch(exception) {
      return false;
  }
}

export const getDataObject = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    return null;
  }
}
export interface IUser {
  id: string;
  name: string;
  avatar: string;
  email: string
}
export interface IStore {
  user: IUser;
  isLogin: boolean;
  accessToken: string;
}
export const initData: IStore = {
  user: {
    id: "",
    name: "",
    avatar: "",
    email: ""
  },
  isLogin: false,
  accessToken: ""
}

export const StoreContext = React.createContext<{ state: IStore, dispatch: React.Dispatch<any> }>({ state: initData, dispatch: () => null });

export const useStore = () => React.useContext(StoreContext);

export const reducer = (state: IStore, action: any): IStore => {
  switch (action.type) {
    case "LOGIN":
      const payload = action.payload;
      const user = {
        id: payload.id,
        avatar: payload.avatar,
        name: payload?.username ?? "Name 1",
        email: ""
      }

      storeData("token", payload.token);
      storeDataObject("user", user);
      axios.defaults.params = {
        token: payload.token
      }
      return {
        ...state,
        accessToken: payload.token,
        isLogin: true,
        user
      };

    case "LOAD_INIT_DATA":
      if (action.payload.token) {
        axios.defaults.params = {
          token: action.payload.token
        }
        return {
          ...state,
          accessToken: action.payload.token,
          user: action.payload.user,
          isLogin: true
        }
      }
      return state;
      case "UPDATE_USER":
        // const user = action.payload;
        return state;
    case "LOG_OUT":
      clearDataStore().then();
      return initData;
    default:
      return state;
  }
}