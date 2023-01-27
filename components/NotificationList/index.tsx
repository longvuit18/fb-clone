import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { NotificationItem } from './NotificationItem'
export const NotificationList = (props: any) => {

  const { notifications } = props
  if (notifications.length === 0) return <View></View>
  return (
    <View style={styles.container}>
      {notifications.map((notification: any, index: number) => (
        <NotificationItem key={"notification" + index} item={notification} />
      ))}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {

  }
})

