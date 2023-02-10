import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, Button, TouchableOpacity, View } from 'react-native';
import { STATUSBAR_HEIGHT, SCREEN_WIDTH, resultTypes, SCREEN_HEIGHT } from '../../constants';
import ExTouchableOpacity from '../../components/ExTouchableOpacity'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { TextInput } from 'react-native-gesture-handler'
import { useState } from 'react';
// import Posts from '../../components/SearchResult'

export default function Search(props) {
  return (
    <View style={styles.container}>
      <View style={styles.searchToolWrapper}>
        <ExTouchableOpacity style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" size={20} />
        </ExTouchableOpacity>
        <View>
          <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#333" />
        </View>
      </View>
      {/* Categories */}
      <ScrollView
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.categories}>
        <TouchableOpacity
          style={{ ...styles.btnCategory, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnCategory, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>POST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnCategory, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>PEOPLE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnCategory, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>EVENT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnCategory, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>GROUPS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnCategory, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>PAGES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnCategory, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>VIDEOS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnCategory, marginRight: 15, backgroundColor: '#318bfb' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>IMAGES</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* <ScrollView
        ref="_scrollRef"
        style={{ ...styles.resultWrapper, height: SCREEN_HEIGHT - STATUSBAR_HEIGHT - 50 - 48 }}
        bounces={false}>
        <Peoples
          hidden={currentCategory !== resultTypes.ALL && currentCategory !== resultTypes.PEOPLE}
          isShowPreview={currentCategory !== resultTypes.PEOPLE}
          showAllFn={this.onPressChangeCategoryHandler.bind(this, resultTypes.PEOPLE)} />
        <Posts
          hidden={currentCategory !== resultTypes.ALL && currentCategory !== resultTypes.POST}
          isShowPreview={currentCategory !== resultTypes.POST}
          showAllFn={this.onPressChangeCategoryHandler.bind(this, resultTypes.POST)} />
        <Pages hidden={currentCategory !== resultTypes.ALL && currentCategory !== resultTypes.PAGE}
          isShowPreview={currentCategory !== resultTypes.PAGE}
          showAllFn={this.onPressChangeCategoryHandler.bind(this, resultTypes.PAGE)} />
        <Groups hidden={currentCategory !== resultTypes.ALL && currentCategory !== resultTypes.GROUP}
          isShowPreview={currentCategory !== resultTypes.GROUP}
          showAllFn={this.onPressChangeCategoryHandler.bind(this, resultTypes.GROUP)} />
      </ScrollView> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {

  },
  searchToolWrapper: {
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    height: 50 + STATUSBAR_HEIGHT,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  resultWrapper: {
    height: SCREEN_HEIGHT - STATUSBAR_HEIGHT - 50 - 48
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
  categories: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  btnCategory: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5
  },
})

