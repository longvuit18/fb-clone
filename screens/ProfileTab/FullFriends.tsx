import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
import ExTouchableOpacity from '../../components/ExTouchableOpacity'

export default function FullFriends(props) {
  var keyword = []
  var friends = [
    {
      name: "Nguyễn Đức Nguyên",
      avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/314965434_2890110954618969_4295270053510347243_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Q_1x_WBiZvcAX_gY8B3&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfCPWJr3uoCRqoi5OecRbpvX6ePTOzYDgJ-lAWszXiNkfA&oe=63ACDB13",
      isRecent: 1,
      mutualFriends: 25
    },
    {
      name: "Đỗ Thị Thu Hoà",
      avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-9/41585523_2191322511147619_4326148844468305920_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=OkVD7j2cUJMAX9UnJOF&tn=5-cCzEExNYSV7PRA&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfDpMaSiA0Wy_rStYQdrVt6P-QgjoOt6_Zcy1j5p7VE_Og&oe=63CFC9A1",
      isRecent: 1,
      mutualFriends: 32
    },
  ]
  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <ExTouchableOpacity style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" color="#000" size={20} />
        </ExTouchableOpacity>
        <ExTouchableOpacity style={styles.btnBack}>
          <FontAwesome5Icon name="search" color="#000" size={20} />
        </ExTouchableOpacity>
      </View>
      <View style={styles.searchToolWrapper}>
        <View style={styles.filterWrapper}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{ ...styles.btnFilter, backgroundColor: '#ddd' }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{ ...styles.btnFilter, marginLeft: 10, backgroundColor: '#9dd0eb' }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: "#318bfb" }}>Recent</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchTool}>
          <View style={styles.btnSearchIcon}>
            <FontAwesome5Icon name="search" color="gray" size={16} />
          </View>
          <TextInput style={styles.searchInput} placeholder="Search Friends"></TextInput>
        </View>
      </View>
      <ScrollView
        // ref="_horizontalScrollRef"
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView
          style={styles.friendsWrapper}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.friendsCount}>{friends.length} Friends</Text>
          <View style={styles.friends}>
            {friends.map((friend, index) => (
              <View key={index}>
                {
                  friend.name.indexOf("keyword") > -1 ? (
                    <ExTouchableOpacity key={index} style={styles.friendItem}>
                      <Image source={{ uri: friend.avatar_url }} style={styles.friendAvatar} />
                      <View style={styles.friendInfoWrapper}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendMutualCount}>{friend.mutualFriends} mutual friends</Text>
                      </View>
                      <ExTouchableOpacity style={styles.btnFriendOptions}>
                        <FontAwesome5Icon name="ellipsis-h" size={20} />
                      </ExTouchableOpacity>
                    </ExTouchableOpacity>
                  ) : <View></View>
                }
              </View>
            ))}
          </View>
        </ScrollView>
        <ScrollView
          style={styles.friendsWrapper}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.friends}>
            {friends.map((friend, index) => (
              <View key={index}>
                {
                  friend.isRecent ? (
                    <ExTouchableOpacity key={index} style={styles.friendItem}>
                      <Image source={{ uri: friend.avatar_url }} style={styles.friendAvatar} />
                      <View style={styles.friendInfoWrapper}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendMutualCount}>{friend.mutualFriends} mutual friends</Text>
                      </View>
                      <TouchableOpacity style={styles.btnFriendOptions}>
                        <FontAwesome5Icon name="ellipsis-h" size={20} />
                      </TouchableOpacity>
                    </ExTouchableOpacity>
                  ) : <View></View>
                }
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  navigationBar: {
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    height: 94,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  btnBack: {
    width: 50,
    alignItems: 'center'
  },
  navigationTitle: {
    fontSize: 18
  },
  searchToolWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  filterWrapper: {
    flexDirection: 'row',
  },
  btnFilter: {
    paddingHorizontal: 15,
    backgroundColor: '#ddd',// '#9dd0eb'
    borderRadius: 50,
    height: 40,
    justifyContent: 'center'
  },
  btnFilterActived: {
    backgroundColor: '#9dd0eb',// 
  },
  searchTool: {
    flexDirection: 'row',
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 50
  },
  btnSearchIcon: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ddd",
    width: 40
  },
  searchInput: {
    height: 40,
    width: SCREEN_WIDTH - 30 - 40, //paddingHorizontal btnSearch
    backgroundColor: "#ddd",
    paddingRight: 30
  },
  friendsWrapper: {
    padding: 15,
    paddingTop: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - (STATUSBAR_HEIGHT + 50) - 120,//navigation bar searchTool
  },
  friendsCount: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  friends: {

  },
  friendItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center'
  },
  friendAvatar: {
    height: 80,
    width: 80,
    borderRadius: 80,
    borderColor: '#333',
    borderWidth: 0.2
  },
  friendInfoWrapper: {
    width: SCREEN_WIDTH - 30 - 80 - 30,//paddingHorizontal avatar optionBtn,
    paddingLeft: 15
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600'
  },
  friendMutualCount: {
    color: '#333'
  },
  btnFriendOptions: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
