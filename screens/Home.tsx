import React from "react";
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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Story from '../components/Story';
import Post from '../components/Post';
import axios from "axios";


interface IPost  {
  id?: string;
  authorName?: string;
  urlAvatar?: string;
  timePost?: string;
  contentPost?:
    string;
  numberImage?: string;
  hasVideo?: boolean;
  hasMedia?: boolean;
  urlImage?: object;
  numberLike?: object;
  textComment?: string;
  isLiked? : boolean,
}
function HomeScreen(props: any) {
  const [data, setData] = React.useState<IPost[]>([])
  const getPosts = async () => {
    try {
      const posts = await axios.post("/post/get_list_posts?last_id=0&index=0&count=20");

      const mapData = posts.data.data.posts.map((post: any) => {
        let createdDate = new Date(Number.parseInt(post.created));
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
          authorName: post.author.username,
          urlAvatar: post.author.avatar,
          contentPost: post.described,
          numberImage: post.image ? post.image.length : 0,
          timePost: timePost,
          hasVideo: false,
          hasMedia: post.image || post.video ? true : false,
          urlImage: urlImage,
          numberLike: post.like,
          textComment: post.comment +  ' bình luận',
          isLiked: post.is_liked == "1" ? true : false
        }
        )
      })

      

      setData(mapData);
      
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

  React.useEffect(() => {
    getPosts();
  }, [])
  var lstStory = [
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        scrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
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
          <TouchableOpacity>
            <Image
              resizeMode="cover"
              style={styles.avatar}
              source={require('../assets/avatar/avatar4.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => props.navigation.navigate("UploadPost")}>
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
          <Post key={index} data={post} navigation={props.navigation}/>
        ))}
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
