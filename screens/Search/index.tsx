import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import ExTouchableOpacity from '../../components/ExTouchableOpacity'
import { STATUSBAR_HEIGHT, SCREEN_WIDTH, searchType } from '../../constants'
export default function index(props) {
  var recentSearchings = [
    {
      type: 0,
      keyword: ""
    },
    {
      type: 1,
      user: {
        avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/314965434_2890110954618969_4295270053510347243_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Q_1x_WBiZvcAX_gY8B3&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfCPWJr3uoCRqoi5OecRbpvX6ePTOzYDgJ-lAWszXiNkfA&oe=63ACDB13",
        name: "Nguyễn Đức Nguyên"
      }
    },
    {
      type: 2,
      page: {
        avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/314965434_2890110954618969_4295270053510347243_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Q_1x_WBiZvcAX_gY8B3&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfCPWJr3uoCRqoi5OecRbpvX6ePTOzYDgJ-lAWszXiNkfA&oe=63ACDB13",
        name: "Nguyễn Đức Nguyên"
      }
    },
    {
      type: 3,
      group: {
        name: "BIẾT THẾ ĐÉO ĐI LÀM",
        avatar_url: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/298583658_183786070731362_6462470391432866728_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Bwqbbmmnjj8AX8ALrLW&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfBonR4jeo_02UgZVwrXeMxcgeim7hVFKAE7TU7NOzW8-g&oe=63ACB07F"
      }
    }
  ]
  return (
    <View style={styles.container}>
      <View style={styles.searchToolWrapper}>
        <ExTouchableOpacity style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" size={20} />
        </ExTouchableOpacity>
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#333" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.titleWrapper}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Recent searching</Text>
          {/* <TouchableOpacity style={styles.btnModify}>
            <Text>MODIFY</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.recentSearchWrapper}>
          {recentSearchings.map((searching, index) => (
            <ExTouchableOpacity
              key={index}
              style={styles.recentSearchItem}>
              {searching.type === searchType.KEYWORD
                ? (<View style={styles.searchIconWrapper}><FontAwesome5Icon name="search" size={14} color="gray" /></View>)
                : <Image style={styles.avatar} source={{ uri: searching.user?.avatar_url || searching.page?.avatar_url || searching.group?.avatar_url }} />
              }
              <Text style={{ fontSize: 16, marginLeft: 10 }}>
                {searching.keyword || searching.user?.name || searching.page?.name || searching.group?.name}
              </Text>
            </ExTouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  searchToolWrapper: {
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    height: 50 + STATUSBAR_HEIGHT,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  btnBack: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchInput: {
    height: 40,
    width: SCREEN_WIDTH - 40 - 15,
    borderRadius: 40,
    backgroundColor: '#ddd',
    paddingHorizontal: 20
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 36,
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  btnModify: {
    fontSize: 16,
    color: '#333'
  },
  recentSearchWrapper: {
    backgroundColor: 'rgba(0,0,0,0.3)',

  },
  recentSearchItem: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',

  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderColor: '#333',
    borderWidth: 0.2
  },
  searchIconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
