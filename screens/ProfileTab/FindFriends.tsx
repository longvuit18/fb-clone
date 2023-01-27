import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
import ExTouchableOpacity from '../../components/ExTouchableOpacity'

export default function FindFriends(data) {
  var recommendFriends = [
    {
      user: {
        name: "Nguyễn Đức Nguyên",
        avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/314965434_2890110954618969_4295270053510347243_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Q_1x_WBiZvcAX_gY8B3&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfCPWJr3uoCRqoi5OecRbpvX6ePTOzYDgJ-lAWszXiNkfA&oe=63ACDB13"
      },
      mutualCount: 25
    },
    {
      user: {
        name: "Đỗ Thị Thu Hoà",
        avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-9/41585523_2191322511147619_4326148844468305920_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=OkVD7j2cUJMAX9UnJOF&tn=5-cCzEExNYSV7PRA&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfDpMaSiA0Wy_rStYQdrVt6P-QgjoOt6_Zcy1j5p7VE_Og&oe=63CFC9A1"
      },
      mutualCount: 32
    },
  ]
  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <ExTouchableOpacity style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" size={20} />
        </ExTouchableOpacity>
        <ExTouchableOpacity

          activeOpacity={0.8}
          style={styles.searchInput}>
          <FontAwesome5Icon name="search" size={16} color="gray" />
          <Text style={{ color: 'gray', marginLeft: 10, fontSize: 16 }}>Search</Text>
        </ExTouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.btnNavigationsWrapper}>
          <TouchableOpacity style={{ ...styles.btnNavigation, marginRight: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Friend Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNavigation}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>All Friends</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recommendFriendsWrapper}>
          <Text style={styles.recommendFriendsTitle}>People you may know</Text>
          <View style={styles.recommendFriends}>
            {recommendFriends.map((recommend, index) => (
              <ExTouchableOpacity key={index} style={styles.recommendFriendItem}>
                <Image style={styles.avatar} source={{ uri: recommend.user.avatar_url }} />
                <View style={styles.recommendInfo}>
                  <Text style={styles.name}>{recommend.user.name}</Text>
                  <Text style={styles.mutualCount}>{recommend.mutualCount} mutual friends</Text>
                  <View style={styles.btnActionsWrapper}>
                    <TouchableOpacity style={styles.btnAddFriend}>
                      <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>Add Friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnHide}>
                      <Text style={{ color: '#000', fontWeight: '500', fontSize: 16 }}>Hide</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ExTouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  navigationBar: {
    flexDirection: 'row',
    paddingTop: STATUSBAR_HEIGHT,
    height: 94,
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  btnBack: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchInput: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    width: SCREEN_WIDTH - 40 - 15,
    height: 36,
    borderRadius: 40,
    alignItems: 'center',
    paddingHorizontal: 15
  },
  btnNavigationsWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15
  },
  btnNavigation: {
    height: 36,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 40,
    backgroundColor: "#ddd"
  },
  scrollContainer: {
    paddingHorizontal: 15,
    height: SCREEN_HEIGHT - (STATUSBAR_HEIGHT + 50)
  },
  recommendFriendsWrapper: {
    paddingVertical: 15
  },
  recommendFriendsTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  recommendFriends: {
    paddingVertical: 7.5
  },
  recommendFriendItem: {
    flexDirection: 'row',
    marginVertical: 7.5,
    alignItems: 'center'
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 100
  },
  recommendInfo: {
    width: SCREEN_WIDTH - 30 - 100,
    paddingLeft: 10
  },
  name: {
    fontSize: 16,
    fontWeight: '500'
  },
  mutualCount: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5
  },
  btnActionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnAddFriend: {
    width: '48.5%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#318bfb',
    borderRadius: 5
  },
  btnHide: {
    width: '48.5%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#ddd'
  }
})