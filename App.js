import React from 'react';
import { Text, View } from 'react-native';
import AvatarOptions from './screens/ProfileTab/AvatarOptions'
import EditPublicInfo from './screens/ProfileTab/EditPublicInfo'
import FindFriends from './screens/ProfileTab/FindFriends'
import FriendOptions from './screens/ProfileTab/FriendOptions'
import FriendRequests from './screens/ProfileTab/FriendRequests'
import FullFriends from './screens/ProfileTab/FullFriends'
import ProfilePostOptions from './screens/ProfileTab/ProfilePostOptions'
import ProfileSetting from './screens/ProfileTab/ProfileSetting'
import ProfileX from './screens/ProfileTab/ProfileX'
import ProfileTab from './screens/ProfileTab'

import GroupSearch from './screens/Search/GroupSearch'
import Search from './screens/Search'
import Result from './screens/Search/Result'
import WatchSearch from './screens/Search/WatchSearch'

const HelloWorldApp = () => {
  return (
    <View>
      <EditPublicInfo/>
    </View>
  )
}
export default HelloWorldApp;