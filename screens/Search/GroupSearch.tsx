import React, { PureComponent, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, TextInput, SafeAreaView, Dimensions, Image } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { STATUSBAR_HEIGHT, SCREEN_WIDTH, searchType } from '../../constants'
import ExTouchableOpacity from '../../components/ExTouchableOpacity'

export default function GroupSearch(props) {
  var groupHistories = [
    {
      isResult : 1,
      keyword : "đi làm",
      group : {
        name : "BIẾT THẾ ĐÉO ĐI LÀM",
        avatar_url : "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/298583658_183786070731362_6462470391432866728_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Bwqbbmmnjj8AX8ALrLW&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfBonR4jeo_02UgZVwrXeMxcgeim7hVFKAE7TU7NOzW8-g&oe=63ACB07F"
      }
    },
    {
      isResult : 0,
      keyword : "đi làm",
      group : {
        name : "BIẾT THẾ ĐÉO ĐI LÀM",
        avatar_url : "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/298583658_183786070731362_6462470391432866728_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Bwqbbmmnjj8AX8ALrLW&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfBonR4jeo_02UgZVwrXeMxcgeim7hVFKAE7TU7NOzW8-g&oe=63ACB07F"
      }
    }
  ]
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchToolWrapper}>
        <ExTouchableOpacity style={styles.btnBack}>
          <FontAwesome5Icon size={20} name="arrow-left"></FontAwesome5Icon>
        </ExTouchableOpacity>
        <TextInput placeholder="Search groups" style={styles.searchInput}>

        </TextInput>
      </View>
      <View style={styles.historyWrapper}>
        <View style={styles.historyTitle}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Recent searched groups
          </Text>
          <ExTouchableOpacity>
            <Text>
              MODIFY
            </Text>
          </ExTouchableOpacity>
        </View>
        {groupHistories.map((history, index) => (
          <View key={index}>
            {history.isResult ? (
              <ExTouchableOpacity style={styles.searchResult}>
                <Image style={{ width: 20, height: 20, marginRight: 5, borderRadius: 5 }} source={{ uri: history.group.avatar_url }}></Image>
                <Text>{history.group.name}</Text>
              </ExTouchableOpacity>
            ) : (
              <ExTouchableOpacity style={styles.searchResult}>
                <FontAwesome5Icon style={{ width: 25 }} name="search" color="#ddd"></FontAwesome5Icon>
                <Text>{history.keyword}</Text>
              </ExTouchableOpacity>
            )}
          </View>
        ))}
      </View>
      <View style={styles.groupCategoriesWrapper}>
        <View style={styles.groupCategoriesTitle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Popular group categories</Text>
        </View>
        <ExTouchableOpacity style={styles.btnSeeAll}>
          <Text>See all</Text>
          <FontAwesome5Icon name="arrow-right"></FontAwesome5Icon>
        </ExTouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const screenWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  searchToolWrapper: {
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50 + STATUSBAR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  btnBack: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchInput: {
    borderRadius: 40,
    backgroundColor: '#ddd',
    width: screenWidth - 60,
    height: 40,
    paddingHorizontal: 20
  },
  historyWrapper: {
    borderBottomWidth: 5,
    borderBottomColor: '#ddd'
  },
  historyTitle: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    borderBottomColor: '#ddd'
  },
  searchResult: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  groupCategoriesWrapper: {

  },
  groupCategoriesTitle: {
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd'
  },
  btnSeeAll: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    height: 40,
    alignItems: 'center',

  }
})
