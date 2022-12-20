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
      authorName?: string;
      urlAvatar?: string;
      timePost?: string;
      contentPost?:
        string;
      numberImage?: string;
      hasVideo?: boolean;
      hasMedia?: boolean;
      urlImage1?: string;
      urlImage2?: string;
      urlImage3?: string;
      urlImage4?: string;
      numberLike?: string;
      textComment?: string;
    }
function HomeScreen(props: any) {
  const [data, setData] = React.useState<IPost[]>([])
  const getPosts = async () => {
    try {
      const posts = await axios.post("/post/get_list_posts?last_id=0&index=0&count=20");

      const mapData = posts.data.data.posts.map((post: any) => {
        return ({
          authorName: post.author.username,
          urlAvatar: post.author.avatar,
          contentPost: post.described,
        }
        )
      })

      

      setData(mapData);
      
    } catch (error) {
      throw error;
    }
    
   // console.log(posts);
    
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

  var lstPost = [
    {
      authorName: 'Trần Hà',
      urlAvatar: 'https://i.ibb.co/5kDFTz5/avatar4.png',
      timePost: 'Vừa xong',
      contentPost:
        'MÙA BỒ KẾT đã qua được hơn nửa rồi.\nBây giờ bồ kết đã già, cầm lên sẽ nghe tiếng hạt xào xạo ở bên trong, phơi qua một nắng là đã thấy mùi thơm phảng phất dễ chịu',
      numberImage: 2,
      hasVideo: false,
      hasMedia: true,
      urlImage1: 'https://i.ibb.co/27xWkbV/story4.png',
      urlImage2: 'https://i.ibb.co/WsFZXtp/story1.png',
      urlImage3: '',
      urlImage4: '',
      numberLike: '50',
      textComment: '100 bình luận',
    },
    {
      authorName: 'Trần Hà',
      urlAvatar: 'https://i.ibb.co/5kDFTz5/avatar4.png',
      timePost: 'Vừa xong',
      contentPost:
        'MÙA BỒ KẾT đã qua được hơn nửa rồi.\nBây giờ bồ kết đã già, cầm lên sẽ nghe tiếng hạt xào xạo ở bên trong, phơi qua một nắng là đã thấy mùi thơm phảng phất dễ chịu',
      numberImage: 3,
      hasVideo: false,
      hasMedia: true,
      urlImage1: 'https://i.ibb.co/27xWkbV/story4.png',
      urlImage2: 'https://i.ibb.co/WsFZXtp/story1.png',
      urlImage3: 'https://i.ibb.co/Q6cF7Cm/story2.png',
      urlImage4: '',
      numberLike: '50',
      textComment: '100 bình luận',
    },
    {
      authorName: 'Trần Hà',
      urlAvatar: 'https://i.ibb.co/5kDFTz5/avatar4.png',
      timePost: 'Vừa xong',
      contentPost:
        'MÙA BỒ KẾT đã qua được hơn nửa rồi.\nBây giờ bồ kết đã già, cầm lên sẽ nghe tiếng hạt xào xạo ở bên trong, phơi qua một nắng là đã thấy mùi thơm phảng phất dễ chịu',
      numberImage: 1,
      hasVideo: false,
      hasMedia: true,
      urlImage1: 'https://i.ibb.co/27xWkbV/story4.png',
      urlImage2: '',
      urlImage3: '',
      urlImage4: '',
      numberLike: '50',
      textComment: '100 bình luận',
    },
    {
      authorName: 'Trần Hà',
      urlAvatar: 'https://i.ibb.co/5kDFTz5/avatar4.png',
      timePost: 'Vừa xong',
      contentPost:
        'MÙA BỒ KẾT đã qua được hơn nửa rồi.\nBây giờ bồ kết đã già, cầm lên sẽ nghe tiếng hạt xào xạo ở bên trong, phơi qua một nắng là đã thấy mùi thơm phảng phất dễ chịu',
      numberImage: 4,
      hasVideo: false,
      hasMedia: true,
      urlImage1: 'https://i.ibb.co/27xWkbV/story4.png',
      urlImage2: 'https://i.ibb.co/WsFZXtp/story1.png',
      urlImage3: 'https://i.ibb.co/Q6cF7Cm/story2.png',
      urlImage4: 'https://i.ibb.co/h1CkkfT/story3.png',
      numberLike: '50',
      textComment: '100 bình luận',
    },
    {
      authorName: 'Trần Hà',
      urlAvatar: 'https://i.ibb.co/5kDFTz5/avatar4.png',
      timePost: 'Vừa xong',
      contentPost:
        'MÙA BỒ KẾT đã qua được hơn nửa rồi.\nBây giờ bồ kết đã già, cầm lên sẽ nghe tiếng hạt xào xạo ở bên trong, phơi qua một nắng là đã thấy mùi thơm phảng phất dễ chịu',
      numberImage: 0,
      hasVideo: false,
      hasMedia: false,
      urlImage1: '',
      urlImage2: '',
      urlImage3: '',
      urlImage4: '',
      numberLike: '50',
      textComment: '100 bình luận',
    },
    {
      authorName: 'Trần Hà',
      urlAvatar: 'https://i.ibb.co/5kDFTz5/avatar4.png',
      timePost: 'Vừa xong',
      contentPost:
        'MÙA BỒ KẾT đã qua được hơn nửa rồi.\nBây giờ bồ kết đã già, cầm lên sẽ nghe tiếng hạt xào xạo ở bên trong, phơi qua một nắng là đã thấy mùi thơm phảng phất dễ chịu',
      numberImage: 0,
      hasVideo: true,
      hasMedia: true,
      urlImage1: '',
      urlImage2: '',
      urlImage3: '',
      urlImage4: '',
      urlVideo: 'https://vjs.zencdn.net/v/oceans.mp4',
      numberLike: '50',
      textComment: '100 bình luận',
    },
  ];
  
  return (
    <View style={styles.container}>
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 8,
          }}>
          <TouchableOpacity style={styles.avatarContainer}>
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
          <Post key={index} data={post}/>
        ))}
      </ScrollView>
      
    </View>
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
    height: 40,
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
  avatarContainer: {},
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
