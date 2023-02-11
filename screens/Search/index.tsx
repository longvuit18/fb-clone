import React, { Component, useState } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ExTouchableOpacity from '../../components/ExTouchableOpacity'
import { useNavigation } from '@react-navigation/native';
import { STATUSBAR_HEIGHT, SCREEN_WIDTH, searchType, SCREEN_HEIGHT, BASE_URL } from '../../constants'
import Post from '../../components/Post'
import axios from 'axios';
import { getData, getDataObject, IUser, useStore } from '../../store';
interface IPost {
  id?: string;
  authorName?: string;
  urlAvatar?: string;
  timePost?: string;
  contentPost?: string;
  numberImage?: string;
  hasVideo?: boolean;
  hasMedia?: boolean;
  urlImage?: object;
  numberLike?: object;
  textComment?: string;
  isLiked?: boolean;
  status?: string;
  canEdit?: boolean
}
interface RSearch {
  id?: string,
  keyword?: string
}
export default function Search(props) {
  const navigation = useNavigation();
  const [recentSearchings, setRecentSearchings] = useState<RSearch[]>([])
  const { state } = useStore();
  const [data, setData] = React.useState<IPost[]>([])
  const [keyword, setKeyword] = useState<string>("");
  const [deleteID, setDeleteID] = useState<string>("");
  const [blockList, setBlockList] = useState<string[]>([]);
  const [isNull, setIsNull] = useState<boolean>(true);

  const deleteRecentSearch = async () => {
    try {
      var requestOptions: RequestInit = {
        method: "POST",
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
      };
      const res = await axios.post(`/search/del_saved_search?search_id=${deleteID}&all=0`)
    } catch (error) {
      throw error;
    }
  }
  const deleteFunc = (id: string) => {
    setDeleteID(id);
    deleteRecentSearch();
  }
  const getBlockList = async () => {
    try {
      const response = await axios.post(`/friend/get_list_blocks?index=0&count=10`);
      const data = response.data.data;
      var res = [];
      for (var i = 0; i < data.length; i += 1) {
        res.push(data[i]["id"]);
      }
      setBlockList(res);
    } catch (error) {
      setBlockList([]);
      console.log(error)
    }
  }
  const getRecentSearch = async () => {
    try {
      const recent = await axios.post(`/search/get_saved_search?index=0&count=10`);
      const mapData = recent.data.data.map((keyword: any) => {

        return ({
          id: keyword.id,
          keyword: keyword.keyword
        })
      })
      setRecentSearchings([]);
      setRecentSearchings(mapData);
    } catch (error) {
      throw error;
    }
    // const mapSearch = recent.data.data;`
  }
  const getTimeBetweenTwoDate = (firstDate: Date, secondDate: Date) => {
    const seconds = (secondDate.getTime() - firstDate.getTime()) / 1000;
    if (seconds < 60) {
      return "Vừa xong";
    }
    else if (seconds < 3600) {
      let minutes = Math.ceil(seconds / 60);
      return minutes + " phút";
    }
    else if (seconds < 86400) {
      let hours = Math.ceil(seconds / 3600);
      return hours + " giờ";
    }
    else if (seconds < 432000) {
      let days = Math.ceil(seconds / 86400);
      return days + " ngày";
    }
    else {
      return firstDate.getDate() + " thg " + (firstDate.getMonth() + 1) + ", " + firstDate.getUTCFullYear()
    }
  }
  const callBackEventPost = (index: number) => {
    var tempData = data;
    tempData.splice(index, 1);
    //Chả hiểu sao nó lại không ăn render. nên phải xoá hết đi rồi mới vẽ lại
    setData([]);
    setData([...tempData]);
  }
  const searchPost = async () => {
    console.log(keyword)
    try {
      var uri = "/search/search?index=0&count=20&keyword=" + keyword.toString();
      const posts = await axios.post(uri);
      const mapData = posts.data.data.map((post: any) => {
        if (blockList.includes(post.author.id) == false) {
          let createdDate = new Date(Number.parseInt((post.created * 1000).toString()));
          let now = new Date();
          let timePost = getTimeBetweenTwoDate(createdDate, now);
          let urlImage: any[] = [];
          let numberImage = post.image ? post.image.length : 0;
          if (numberImage > 0) {
            post.image.forEach((image: any) => {
              return urlImage.push(image)
            })
          }

          return ({
            id: post.id,
            authorName: post.author.username,
            urlAvatar: post.author.avatar,
            contentPost: post.described,
            numberImage: post.image ? post.image.length : 0,
            timePost: timePost,
            hasVideo: false,
            hasMedia: post.image || post.video ? true : false,
            urlImage: urlImage,
            numberLike: post.like,
            textComment: post.comment + ' bình luận',
            isLiked: post.is_liked == "1" ? true : false,
            status: post.state,
            canEdit: post.author.id == state.user.id ? true : false,
          }
          )
        } else {
          return null;
        }
      }).filter(elements => {
        return elements !== null;
       });
      setData(mapData);
      setIsNull(false);
    } catch (error) {
      setData([]);
      setIsNull(true);
      throw error;
    }
  }
  React.useEffect(() => {
    // getBlockList();
    getRecentSearch();
  }, [])
  const handleRecentSearch = (text) => {
    setKeyword(text);
    searchPost();
  }
  return (
    <View style={styles.container}>
      <View style={styles.searchToolWrapper}>
        <ExTouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" size={20} />
        </ExTouchableOpacity>
        <TextInput onBlur={searchPost} onChangeText={(keyword) => setKeyword(keyword)} style={styles.searchInput} placeholder="Search..." placeholderTextColor="#333" />
      </View>
      <ScrollView
        // ref="_scrollRef"
        style={{ ...styles.resultWrapper, height: SCREEN_HEIGHT - STATUSBAR_HEIGHT - 50 - 48 }}
        bounces={false}>
        {data.map((post, index) => (
          <TouchableOpacity>
            {isNull != true
              ? <TouchableOpacity key={"post" + index}><Post  indexPost={index} data={post} navigation={props.navigation} callBackEvent={callBackEventPost} /></TouchableOpacity>
              : <View style={styles.titleWrapper}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Khoong cos bai viet</Text>
            </View>}
          </TouchableOpacity>
        ))}
        <View style={styles.titleWrapper}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Từ khoá đã tìm kiếm</Text>
        </View>
        <View style={styles.recentSearchWrapper}>
          {recentSearchings.map((searching, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentSearchItem}
              onPress={() => handleRecentSearch(searching.keyword)}>
              <Text style={{ fontSize: 16, marginLeft: 10 }}>{searching.keyword}</Text>
              <View style={{ flex: 1 }}></View>
              <AntDesign name="close" style={styles.btnClose} size={25} onPress={() => deleteFunc(searching.id)} />
            </TouchableOpacity>

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
    borderBottomWidth: 1,
  },
  searchToolWrapper: {
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
  btnClose: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 5,
  }
})
