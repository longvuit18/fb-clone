import React from "react";

export interface IUser {
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
    name: "",
    avatar: "",
    email: ""
  },
  isLogin: false,
  accessToken: ""
}

export const StoreContext = React.createContext<IStore>(initData);

export const useStore = () => React.useContext(StoreContext);