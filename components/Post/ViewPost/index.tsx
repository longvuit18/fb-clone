import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Button,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import GestureRecognizer from 'react-native-swipe-gestures';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImagePost from "./Image";
import ListImage from "./ListImage"
import axios from "axios";

function ViewPost({ visible, handleEventShow, data, objectLike }: any) {
  const [modalVisible, setModalVisible] = useState(visible);
  const [contentPost, setContentPost] = useState(()=>{
    if(data.contentPost && data.contentPost.length > 200){
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
    if(data.contentPost && data.contentPost.length > 200){
      return true;
    }
    else{
      return false;
    }
  })

  const [visibleViewListImage, setVisibleViewListImage] = useState(false);
  const [indexActive, setIndexActive] = useState<number>(0);
  const [like, setLike] = useState<any>({
    liked: objectLike.liked,
    numberLike: objectLike.numberLike
  })

  const images = data.urlImage.map((image: any, index: number) => {
    return {
      url: image,
      props: {}
    }
  })

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(like);
  };

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const handleSeeMore = () => {
    setShowSeeMore(false);
    setContentPost(data.contentPost);
  }

  const handleViewListImage = (index: number) => {
    setIndexActive(index);
    setVisibleViewListImage(true);
  }

  const onHideViewListImage = () => {
    setVisibleViewListImage(false);
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
      setLike(object);
      data.numberLike = numLike.toString();
      data.isLiked = !like;
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <GestureRecognizer
        style={{flex: 1}}
        onSwipeUp={hiddenModal}
        onSwipeDown={hiddenModal}
        onSwipeRight={hiddenModal}
      >
        <Modal 
          animationType="none" 
          transparent={true} 
          visible={modalVisible}
          onRequestClose={hiddenModal}
        >
          {data.numberImage == 1 && (
              <View style={styles.blackBackground}>
                  <View style={styles.blackContent}>
                    <ImageViewer 
                      imageUrls={images}
                      enableSwipeDown={true}
                      onSwipeDown={hiddenModal}
                    />
                    {/* <Image
                        style={styles.backgroundImage}
                        resizeMode="contain"
                        source={{ uri: data.urlImage[0] }}
                    /> */}
                    
                    <View style={{ width: "100%", flexDirection: "column", position: "absolute", bottom: 8 }}>
                        <Text
                          style={{ fontSize: 15, fontWeight: "600", marginBottom: 4, color: "#fff", paddingLeft: 10 }}
                        >
                          {data.authorName}
                        </Text>
                        <View style={styles.content}>
                          <Text style={{color: "#fff"}}>
                            {contentPost}
                            {showSeeMore && (
                              <TouchableOpacity onPress={handleSeeMore}>
                                <Text style={{ color: "#fff", fontWeight: "600" }}>
                                  ... Xem thêm
                                </Text>
                              </TouchableOpacity>
                              
                            )}
                            
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 10 }}>
                          <Text
                            style={{ marginRight: 5, fontSize: 11, color: "#babec5"}}
                          >
                            {data.timePost}
                          </Text>
                          <FontAwesome5Icon color="#babec5" name="globe-asia" />
                        </View>
                      </View>
                  </View>
                

                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Icon
                      name="thumbs-up"
                      color="#318bfb"
                      // backgroundColor="white"
                      style={{ marginRight: 5 }}
                    ></Icon>
                    <Text style={{ color: "#fff" }}>{like.numberLike}</Text>
                    <View style={{ display: "flex", flex: 1 }}>
                      <Text style={{ color: "#fff", textAlign: "right" }}>
                        {data.textComment}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 40,
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      borderTopWidth: 1,
                      borderColor: "#babec5",
                    }}
                  >
                    <TouchableOpacity style={styles.btnOption} onPress={handleLikePost}>
                      {like.liked ? (
                        <Icon
                          name="thumbs-up"
                          color="#318bfb"
                          // backgroundColor="white"
                          style={styles.iconBtnOption}></Icon>
                      ): 
                      (
                        <Icon
                          name="thumbs-up"
                          color="#fff"
                          // backgroundColor="white"
                          style={styles.iconBtnOption}></Icon>
                      )}

                      <Text style={{ color: like.liked ? '#318bfb' : "#fff" }}>Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnOption, { marginRight: 15 }]}
                    >
                      <Icon
                        name="comment-alt"
                        color="gray"
                        // backgroundColor="white"
                        style={styles.iconBtnOption}
                      ></Icon>
                      <Text style={{ color: "#fff" }}>Bình luận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnOption}>
                      <Icon
                        name="share"
                        color="gray"
                        // backgroundColor="white"
                        style={styles.iconBtnOption}
                      ></Icon>
                      <Text style={{ color: "#fff" }}>Chia sẻ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            
            
          )}

          {data.numberImage != 1 && (
            <ScrollView style={styles.centeredView}>
              <View style={{ flex: 1 }}>
                <View style={styles.author}>
                  <TouchableOpacity>
                    <Image
                      style={styles.avatar}
                      source={{ uri: data.urlAvatar }}
                    />
                  </TouchableOpacity>

                  <View style={{ width: "80%", flexDirection: "column" }}>
                    <Text
                      style={{ fontSize: 15, fontWeight: "600", marginBottom: 4 }}
                    >
                      {data.authorName}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text
                        style={{ marginRight: 5, fontSize: 11, color: "#babec5" }}
                      >
                        {data.timePost}
                      </Text>
                      <FontAwesome5Icon color="#babec5" name="globe-asia" />
                    </View>
                  </View>
                </View>
                <View style={styles.content}>
                  <Text>
                    {contentPost}
                    {showSeeMore && (
                      <TouchableOpacity onPress={handleSeeMore}>
                          <Text style={{ color: "#babec5", fontWeight: "600" }}>
                          ... Xem thêm
                        </Text>
                      </TouchableOpacity>
                      
                    )}
                  </Text>
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Icon
                      name="thumbs-up"
                      color="#318bfb"
                      // backgroundColor="white"
                      style={{ marginRight: 5 }}
                    ></Icon>
                    <Text style={{ color: "#babec5" }}>{like.numberLike}</Text>
                    <View style={{ display: "flex", flex: 1 }}>
                      <Text style={{ color: "#babec5", textAlign: "right" }}>
                        {data.textComment}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 40,
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      borderTopWidth: 1,
                      borderColor: "#babec5",
                    }}
                  >
                    <TouchableOpacity style={styles.btnOption} onPress={handleLikePost}>
                    {like.liked ? (
                        <Icon
                          name="thumbs-up"
                          color="#318bfb"
                          // backgroundColor="white"
                          style={styles.iconBtnOption}></Icon>
                      ): 
                      (
                        <Icon
                          name="thumbs-up"
                          color="#fff"
                          // backgroundColor="white"
                          style={styles.iconBtnOption}></Icon>
                      )}
                      <Text style={{ color: like.liked ? '#318bfb' : "gray" }}>Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnOption, { marginRight: 15 }]}
                    >
                      <Icon
                        name="comment-alt"
                        color="gray"
                        // backgroundColor="white"
                        style={styles.iconBtnOption}
                      ></Icon>
                      <Text style={{ color: "#babec5" }}>Bình luận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnOption}>
                      <Icon
                        name="share"
                        color="gray"
                        // backgroundColor="white"
                        style={styles.iconBtnOption}
                      ></Icon>
                      <Text style={{ color: "#babec5" }}>Chia sẻ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {data.numberImage > 1 &&
                data.urlImage.map((image: string, index: number) => (
                  <ImagePost key={index} urlImage={image} callBackEvent={()=>{handleViewListImage(index)}}/>
                ))}

                <ListImage visible={visibleViewListImage} handleEventShow={onHideViewListImage} data={images} index={indexActive}/>
            </ScrollView>
          )}
        </Modal>
      </GestureRecognizer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#fff",
    outline: "none",
  },
  author: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
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
  btnOption: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtnOption: {
    fontSize: 17,
    marginRight: 5,
  },
  imageContent: {
    width: "100%",
    minHeight: 300,
  },
  image: {
    flex: 1,
  },
  blackBackground: {
    flex: 1,
    backgroundColor: "#000",
    outline: "none",
    position: "relative",
  },
  blackContent: {
    flex: 1,
    paddingVertical: 10,
  },
  backgroundImage: {
    flex: 1,
  },
});

export default ViewPost;
