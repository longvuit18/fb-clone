import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, ImageBackground, TouchableOpacity } from 'react-native'
import { SCREEN_WIDTH } from '../../constants'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ExTouchableOpacity from '../ExTouchableOpacity';
// import { navigation } from '../../rootNavigation';

export const NotificationItem = (props: any) => {
  const item = props.item;
  const icon = props.icon;
  const displayAvatarUri = props.icon
  return (
    <View style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
      <ExTouchableOpacity
        onPress={null}
        // onLongPress={() => null}
        style={{ ...styles.container, backgroundColor: item.isSeen ? '#fff' : '#edf2fa' }}>
        <ImageBackground imageStyle={{ borderRadius: 64 }} style={styles.avatar} source={{ uri: displayAvatarUri }}>
          <View style={{ ...styles.notificationIcon, backgroundColor: icon.bgColor }}>
            <FontAwesome5Icon name={icon.name} size={icon.size} color={icon.color} />
          </View>
        </ImageBackground>
        <View style={styles.contentWrapper}>
          {/* <Description /> */}
          <Text style={{ color: '#333' }}>{item.create_at}</Text>
        </View>
        <ExTouchableOpacity onPress={null} style={styles.btnOptions}>
          <FontAwesome5Icon name="ellipsis-h" />
        </ExTouchableOpacity>
      </ExTouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  avatar: {
    height: 64,
    width: 64,
    position: 'relative',
    borderRadius: 64,
    borderColor: "#ddd",
    borderWidth: 0.5,
  },
  contentWrapper: {
    width: SCREEN_WIDTH - 40 - 30 - 64,
    paddingHorizontal: 10
  },
  mainContent: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  btnOptions: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignContent: 'center'
  },
  pureTxt: {
    fontSize: 16,
  },
  hightlightTxt: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  notificationIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: 25,
    width: 25,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
