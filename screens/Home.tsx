import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Button,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator, 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Story from '../components/Story';
import Post from '../components/Post';
import axios from "axios";
import {useNetInfo} from "@react-native-community/netinfo";
import { getData, useStore, getDataObject, storeDataObject, removeDataStore, IUser } from '../store';

interface IPost  {
  id: string;
  authorId?: string,
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
  isLiked? : boolean;
  status?: string;
  canEdit? : boolean
  isBlock? : boolean
}
function HomeScreen(props: any) {
  const { state, dispatch } = useStore();
  const [data, setData] = React.useState<IPost[]>([])
  const [user, setUser] = useState<IUser>(state.user)
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const netInfo = useNetInfo();
  
  const getPosts = async (isLoadMore : boolean) => {
    //Nếu mất mạng thì load cache ra
    if(!(netInfo.isConnected || netInfo.isConnected == null)){
      await getDataObject("listPost").then(posts => {
        if(posts){
          setData([...posts]);
          setIsLoadMore(false);
          setIsLoading(false);
          setRefreshing(false);
        }
        else{
          alert("Bạn cần kết nối internet để sử dụng!");
        }
      })

      return;
    }
    var userId = state.user.id;

    let last_id = "0";
    if(!refreshing && isLoadMore){
      if(data.length > 0){
        last_id = data[data.length - 1].id;
      }
      setIsLoading(true);
    }

    try {
      const posts = await axios.post(`/post/get_list_posts?last_id=${last_id}&index=0&count=20`);
      
      const mapData = posts.data.data.posts.map((post: any) => {
        let createdDate = new Date(Number.parseInt((post.created * 1000).toString()));
        let now = new Date();
        let timePost = getTimeBetweenTwoDate(createdDate, now);
        let urlImage: any[] = [];
        let numberImage = post.image ? post.image.length : 0;
        if(numberImage > 0){
          post.image.forEach((image : any)=> {
            return urlImage.push(image.url)
          })
        }
        return ({
          id: post.id,
          authorId: post.author.id,
          authorName: post.author.username ? post.author.username : (post.author.id == userId ? 'Me' : 'Unknow'),
          urlAvatar: post.author.avatar ? post.author.avatar : 'https://i.ibb.co/GsY7vbz/contacts-64.png',
          contentPost: post.described,
          numberImage: post.image ? post.image.length : 0,
          timePost: timePost,
          hasVideo: false,
          hasMedia: post.image || post.video ? true : false,
          urlImage: urlImage,
          numberLike: post.like,
          textComment: post.comment +  ' bình luận',
          isLiked: post.is_liked == "1" ? true : false,
          status: post.state,
          canEdit: post.author.id == userId ? true : false,
          isBlock: post.is_blocked == "0" ? false : true
        })
      })

      var realData = mapData.filter((e : any, i : number) => {
        return !e.isBlock
      });

      if(isLoadMore){
        var listPost = [...data, ...realData];
        const uniqueArray = listPost.filter((value, index) => {
          const _value = JSON.stringify(value);
          return index === listPost.findIndex(obj => {
            return JSON.stringify(obj) === _value;
          });
        });
        setData(uniqueArray);
        setIsLoadMore(false);
        setIsLoading(false);
      }
      else{
        setData(realData);
        await removeDataStore("listPost");
        await storeDataObject("listPost", realData);
      }
      setRefreshing(false);
    } catch (error) {
      throw error;
    }
    
   // console.log(posts);
    
  }

  const getTimeBetweenTwoDate = (firstDate : Date, secondDate: Date) => {
    const seconds = (secondDate.getTime() - firstDate.getTime()) / 1000;
    if(seconds < 60){
      return "Vừa xong";
    }
    else if(seconds < 3600){
      let minutes = Math.ceil(seconds / 60);
      return minutes + " phút";
    }
    else if(seconds < 86400){
      let hours = Math.ceil(seconds / 3600);
      return hours + " giờ";
    }
    else if(seconds < 432000){
      let days = Math.ceil(seconds / 86400);
      return days + " ngày";
    }
    else{
      return firstDate.getDate() + " thg " + (firstDate.getMonth()+1) + ", " + firstDate.getUTCFullYear()
    }
  }

  const callBackEventPost = (index: any) => {
    var tempData = data;
    tempData.splice(index, 1);
    //Chả hiểu sao nó lại không ăn render. nên phải xoá hết đi rồi mới vẽ lại
    setData([]);
    setData([...tempData]);
  }

  React.useEffect(() => {
    getPosts(false);
  }, [])

  const handlePullDown = async () => {
    setRefreshing(true);
    setData([]);
    getPosts(false);
  }

  const handleLoadMore = async (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if(currentY >= 2500 && !isLoadMore){
      setIsLoadMore(true);
      await getPosts(true);
      setIsLoadMore(false);
    }
  }

  const handleScrollEndList = async () => {
    if(!isLoadMore){
      setIsLoadMore(true);
      await getPosts(true);
      setIsLoadMore(false);
    }
  }

  var lstStory = [
    {
      avatar: require('../assets/avatar/avatar1.png'),
      name: 'Trần Hà',
      image: require('../assets/story/story1.png'),
    },
    {
      avatar: require('../assets/avatar/avatar4.png'),
      name: 'Nguyễn Ngọc Uyên',
      image: require('../assets/story/story4.png'),
    },
    {
      avatar: require('../assets/avatar/avatar2.png'),
      name: 'Vũ Trang',
      image: require('../assets/story/story2.png'),
    },
    {
      avatar: require('../assets/avatar/avatar3.png'),
      name: 'Minh Quang',
      image: require('../assets/story/story3.png'),
    },
    {
      avatar: require('../assets/avatar/avatar1.png'),
      name: 'Trần Hà',
      image: require('../assets/story/story1.png'),
    },
    {
      avatar: require('../assets/avatar/avatar2.png'),
      name: 'Vũ Trang',
      image: require('../assets/story/story2.png'),
    },
    {
      avatar: require('../assets/avatar/avatar3.png'),
      name: 'Minh Quang',
      image: require('../assets/story/story3.png'),
    },
    {
      avatar: require('../assets/avatar/avatar4.png'),
      name: 'Nguyễn Ngọc Uyên',
      image: require('../assets/story/story4.png'),
    },
  ];

  
  return (
    <SafeAreaView style={styles.container}>
      {refreshing ? 
        <ActivityIndicator/> : 
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          scrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handlePullDown}
            />
          }
          onScroll={handleLoadMore}
          onScrollEndDrag={handleScrollEndList}
          scrollEventThrottle={16}
          
          >
          <View style={styles.header}>
            <Image
              style={styles.logoFB}
              source={{
                uri: 'https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/48MsiA6m666.png',
              }}
            />
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Search")}
              style={{
                borderRadius: 50,
                backgroundColor: '#f1f3f4',
                width: 30,
                height: 30,
                justifyContent: 'center',
              }}>
              <Icon
                name="search"
                color="#000"
                // backgroundColor="white"
                style={{ fontSize: 15, textAlign: 'center' }}></Icon>
            </TouchableOpacity>
          </View> 
          <View></View>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={() => {props.navigation.navigate("ProfileTab")}}>
              <Image
                resizeMode="cover"
                style={styles.avatar}
                source={{uri: user?.avatar ? user?.avatar : 'https://i.ibb.co/GsY7vbz/contacts-64.png' }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => 
              {
                if(!netInfo.isConnected){
                  alert("Bạn cần kết nối internet để sử dụng!");
                }
                else{
                  props.navigation.navigate("UploadPost", 
                  {
                    id: null, mode: 1, 
                    onGoBack: () => {handlePullDown();}
                  })}
                }
              }
              
              >
              <View style={styles.postBtn}>
                <Text style={styles.text}>Bạn đang nghĩ gì?</Text>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.story}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            >
            {lstStory.map((story, index) => (
              <Story key={index} source={story} />
            ))}
          </ScrollView>

          {data.map((post, index) => (
            <Post key={index} indexPost={index} data={post} navigation={props.navigation} callBackEvent={callBackEventPost}/>
          ))}
          {isLoading && <ActivityIndicator size="large" color='#babec5' />}
          
        </ScrollView>
        
      }
      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#cbccd1',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  logoFB: {
    height: 20,
    width: 100,
  },
  page: {
    height: 40,
    backgroundColor: '#fff',
    paddingVertical: 5
  },
  pageIcon: {
    height: 30
  },
  pageIconActive: {
    borderBottomWidth: 2,
    borderColor: '#1877f2',
    width: 50,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 50,
  },
  postBtn: {
    backgroundColor: '#fff',
    height: 32,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    paddingLeft: 20,
    borderColor: '#babec5',
  },
  text: {
    alignItems: 'center',
    flex: 1,
  },
  story: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default HomeScreen;
