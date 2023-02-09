import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Button,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
// import VideoPlayer from 'react-native-video';
import PostOption from "./PostOption";
import Comment from "./Comment";
import ViewPost from "./ViewPost";
import axios from "axios";

function Post({indexPost, data, navigation, callBackEvent }: any) {
  const [visibleOption, setVisibleOption] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);
  const [visibleViewPost, setVisibleViewPost] = useState(false);
  const [contentPost, setContentPost] = useState(()=>{
    if(data.contentPost && data.contentPost && data.contentPost.length > 200){
      let content = data.contentPost.substr(0, 200);
      if(content[content.length - 1] != ' '){
        let index = content.lastIndexOf(" ");
        content = content.substr(0, index);
        return content;
      }
    }
    else{
      return data.contentPost
    }
  })

  const [showSeeMore, setShowSeeMore] = useState(()=>{
    if(data.contentPost && data.contentPost && data.contentPost.length > 200){
      return true;
    }
    else{
      return false;
    }
  })

  const [objectLike, setObjectLike] = useState<any>({
    liked: data.isLiked,
    numberLike: Number.parseInt(data.numberLike)
  })

  const onPress = () => {
    setVisibleOption(true);
  }

  const onHideOption = () => {
    setVisibleOption(false);
  }

  const onHideComment = () => {
    setVisibleComment(false);
  }

  const onHideViewPost = (object: any) => {
    setVisibleViewPost(false);
    setObjectLike(object);
  }

  const handleSeeMore = () => {
    setShowSeeMore(false);
    setContentPost(data.contentPost);
  }

  const handleShowComment = () => {
    navigation.navigate("PostComment", 
    {
      id: data.id, 
      objectLike: objectLike,
      onGoBack: (object: any) => {setObjectLike(object)}
    });
  }

  const handleCallBackOption = (type : number) => {
    if(type == 0){
      Alert.alert('Cảnh báo', 'Bài viết sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn xoá?', [
        {
          text: 'Bỏ qua',
          style: 'cancel',
        },
        {text: 'Tiếp tục', onPress: () => handleDeletePost()},
      ]);
    }
    else{
      navigation.navigate("UploadPost", {id: data.id, mode: 2})
    }
  }

  const handleDeletePost = async () => {
    await axios.post("/post/delete_post?id=" + data.id)
    .then(() => {
      callBackEvent(indexPost);
    })
    .catch((err) => {
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
    })
  }

  const handleLikePost = async () => {
    try{
      const res = await axios.post(`/like/like?id=${data.id}`)
      var like = objectLike.liked;
      var numLike = objectLike.numberLike;
      if(!like){
        numLike = numLike + 1;
      }
      else{
        numLike = numLike - 1;
      }
      var object = {
        liked: !like,
        numberLike: numLike
      }
      setObjectLike(object);
      data.numberLike = numLike.toString();
      data.isLiked = !like;
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.author}>
          <TouchableOpacity>
            <Image
              style={styles.avatar}
              source={{uri: data.urlAvatar}}
            />
          </TouchableOpacity>

          <View style={{ width: '80%', flexDirection: 'column' }}>
            <Text style={{ fontSize: 15, fontWeight: "600", marginBottom: 4 }}>
              {data.authorName}
            </Text>
            {data.status && (
              <Text>Đang cảm thấy <Text style={{fontWeight: "600"}}>{data.status}</Text></Text>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 5, fontSize: 11, color: '#babec5' }}>
                {data.timePost}
              </Text>
              <FontAwesome5Icon color="#babec5" name="globe-asia" />
            </View>
          </View>
          <TouchableOpacity
            style={{ width: 20, backgroundColor: 'transparent' }}
            onPress={onPress}
            >
            <Text style={{ fontSize: 18 }}>...</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text>
            {contentPost}
            {showSeeMore && (
              <TouchableOpacity onPress={handleSeeMore}>
                <Text style={{ color: '#babec5', fontWeight: "600" }}>
                  ... Xem thêm
                </Text>
              </TouchableOpacity>
            )}
            
          </Text>
        </View>
        {data.hasMedia && (
          <TouchableOpacity style={styles.layout} onPress={()=>{setVisibleViewPost(true)}}>
            {data.numberImage == 1 && (
              <View style={styles.oneImage}>
                <ImageBackground
                  source={{uri: data.urlImage[0]}}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            )}
            {data.numberImage == 2 && (
              <View style={styles.twoImage}>
                <View style={{ width: '50%', marginRight: 5 }}>
                  <Image
                    source={{uri: data.urlImage[0]}}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode={'cover'}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <Image
                    source={{uri: data.urlImage[1]}}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode={'cover'}
                  />
                </View>
              </View>
            )}
            {data.numberImage == 3 && (
              <View style={[styles.twoImage, { overflow: 'hidden' }]}>
                <View style={{ width: '50%', marginRight: 5 }}>
                  <Image
                    source={{uri: data.urlImage[0]}}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode={'cover'}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <View
                    style={{ width: '100%', height: '50%', marginBottom: 5 }}>
                    <Image
                      source={{uri: data.urlImage[1]}}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode={'cover'}
                    />
                  </View>
                  <View style={{ width: '100%', height: '50%' }}>
                    <Image
                      source={{uri: data.urlImage[2]}}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode={'cover'}
                    />
                  </View>
                </View>
              </View>
            )}
            {data.numberImage == 4 && (
              <View style={[styles.fourImage, { overflow: 'hidden' }]}>
                <View
                  style={{
                    width: '100%',
                    height: '50%',
                    flexDirection: 'row',
                    marginBottom: 5,
                  }}>
                  <View
                    style={{ width: '50%', height: '100%', marginRight: 5 }}>
                    <Image
                      source={{uri: data.urlImage[0]}}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode={'cover'}
                    />
                  </View>
                  <View style={{ width: '50%', height: '100%' }}>
                    <Image
                      source={{uri: data.urlImage[1]}}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode={'cover'}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '50%',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{ width: '50%', height: '100%', marginRight: 5 }}>
                    <Image
                      source={{uri: data.urlImage[2]}}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode={'cover'}
                    />
                  </View>
                  <View style={{ width: '50%', height: '100%' }}>
                    <Image
                      source={{uri: data.urlImage[3]}}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode={'cover'}
                    />
                  </View>
                </View>
              </View>
            )}
            {data.hasVideo && (
              <View style={[styles.fourImage, { overflow: 'hidden' }]}>
                {/* <VideoPlayer
                  video={{ uri: 'https://vjs.zencdn.net/v/oceans.mp4' }}
                  style={{height: 250}}
                /> */}
              </View>
            )}
          </TouchableOpacity>
        )}

        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginBottom: 5
            }}>
            <Icon
              name="thumbs-up"
              color="#318bfb"
              // backgroundColor="white"
              style={{ marginRight: 5 }}></Icon>
            <Text style={{ color: '#babec5' }}>{objectLike.numberLike}</Text>
            <View style={{ display: 'flex', flex: 1 }}>
              <Text style={{ color: '#babec5', textAlign: 'right' }}>
                {data.textComment}
              </Text>
            </View>
          </View>
          <View style={{ height: 40, flexDirection: 'row', paddingHorizontal: 10, borderTopWidth: 1, borderColor: '#babec5' }}>
            <TouchableOpacity style={styles.btnOption} onPress={handleLikePost}>
              {objectLike.liked ? (
                <Icon
                  name="thumbs-up"
                  color="#318bfb"
                  // backgroundColor="white"
                  style={styles.iconBtnOption}></Icon>
              ): 
              (<Icon
                name="thumbs-up"
                color="#babec5"
                // backgroundColor="white"
                style={styles.iconBtnOption}></Icon>)
              }

              <Text style={{ color: objectLike.liked ? '#318bfb' : "#babec5" }}>Thích</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnOption, {marginRight: 15}]} onPress={handleShowComment}>
              <Icon
                name="comment-alt"
                color="gray"
                // backgroundColor="white"
                style={styles.iconBtnOption}></Icon>
              <Text style={{ color: '#babec5' }}>Bình luận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
              <Icon
                name="share"
                color="gray"
                // backgroundColor="white"
                style={styles.iconBtnOption}></Icon>
              <Text style={{ color: '#babec5' }}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <PostOption 
        visible={visibleOption} 
        handleEventShow={onHideOption} 
        canEdit={data.canEdit}
        callBackEvent={handleCallBackOption}
      />
      {/* <Comment 
        id={data.id} 
        isLike={data.isLiked} 
        numberLike={data.numberLike} 
        visible={visibleComment} 
        handleEventShow={onHideComment}
      /> */}
      <ViewPost 
        visible={visibleViewPost} 
        handleEventShow={onHideViewPost} 
        data={data}
        objectLike={objectLike} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 10
  },
  author: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 50,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  layout: {
    height: 200,
    display: 'flex',
    marginBottom: 5
  },
  oneImage: {
    flex: 1,
    // backgroundColor: 'red',
  },
  twoImage: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  fourImage: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  btnOption: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtnOption: {
    fontSize: 17,
    marginRight: 5,
  },
});

export default Post;
