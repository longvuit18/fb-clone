import React, { useState, useEffect, useRef } from 'react';
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
  TextInput,
  StatusBar,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useNavigation } from '@react-navigation/native';
import Skeleton from '../Post/Skeleton';
import axios from "axios";

interface IComment  {
  avatar?: string,
  author?: string,
  content?: string,
  time?: string,
  isBlock?: boolean,
}

function Comment(props: any) {
  const { navigation, route } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [data, setData] = useState<IComment[]>([]);
  const [curIndex, setCurIndex] = useState(0);
  const [contentComment, setContentComment] = useState('');
  const [objectLike, setObjectLike] = useState<any>({
    liked: route.params.objectLike.liked,
    numberLike: route.params.objectLike.numberLike
  })

  // const navigation = useNavigation();
  let inputRef = useRef<TextInput>(null);

  const getComments = async (index: number) => {
    const curData = data;
    setIsLoading(true);
    try {
      const id = route.params.id;
      await axios.post("/comment/get_comment?id="+id+"&index="+index+"&count=20")
      .then((comments)=>{
        const mapData = comments.data.data.map((comment: any) => {
          let createdDate = new Date(Number.parseInt(comment.created));
          let now = new Date();
          let timePost = getTimeBetweenTwoDate(createdDate, now);
          let content = comment.comment;
          let author = comment.poster.name;
          let avatar = comment.poster.avatar;
          let isBlock = comment.is_blocked == "1"
  
          return ({
            avatar : avatar,
            author : author,
            content : content,
            time : timePost,
            isBlock : isBlock,
          })
        })
  
        const realData = [...curData, ...mapData];
        setData(realData);
        
        setIsLoading(false);
        setIsOffline(false);
      })
      .catch((err)=>{
        setIsLoading(false);
        setIsOffline(false);
        setData(curData);
      })
      
    } catch (error) {
      setIsLoading(false);
      if(index == 0){
        setIsOffline(true);
        setData([]);
      }
      else{
        setIsOffline(false);
      }
      throw error;
    }
    
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

  const regetComment = () => {
    getComments(0);
  }

  const handleGetMoreComment = () => {
    getComments(curIndex + 20);
    setCurIndex(curIndex + 20);
  }

  const handlePostComment = async () => {
    setIsLoading(true);
    setContentComment("");
    (inputRef?.current as any)?.blur();
    (inputRef?.current as any)?.clear();
    const id = route.params.id;
    await axios.post("/comment/set_comment?id="+id+"&comment="+contentComment+"&index=0&count=20")
    .then((comments)=>{
      const mapData = comments.data.data.map((comment: any) => {
        let createdDate = new Date(Number.parseInt(comment.created));
        let now = new Date();
        let timePost = getTimeBetweenTwoDate(createdDate, now);
        let content = comment.comment;
        let author = comment.poster.name;
        let avatar = comment.poster.avatar;
        let isBlock = comment.is_blocked == "1"

        return ({
          avatar : avatar,
          author : author,
          content : content,
          time : timePost,
          isBlock : isBlock,
        })
      })

      setData(mapData);      
      setIsLoading(false);
      setIsOffline(false);
      setCurIndex(0);
    })
    .catch((err)=>{
      setIsLoading(false);
      setIsOffline(false);
    })
  }

  const handleLikePost = async () => {
    try{
      const res = await axios.post(`/like/like?id=${route.params.id}`)
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
      console.log(object);
      setObjectLike(object);
    }
    catch(err){
      console.log(err);
    }
  }

  const handleGoBack = () => {
    route.params.onGoBack(objectLike);
    navigation.goBack()
    
  }

  useEffect(() => {
    getComments(0);
  }, []);

  useEffect(() => {
    const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [objectLike]);

  return (
    <SafeAreaView style={styles.container}>
      <GestureRecognizer
        style={{flex: 1}}
        onSwipeRight={handleGoBack}
      >
          <View style={styles.centeredView}>
            <View style={styles.header}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon
                        name="thumbs-up"
                        color="#318bfb"
                        // backgroundColor="white"
                        style={{ marginRight: 5 }}>    
                    </Icon>
                    <Text style={{fontWeight: "900"}}>{objectLike.numberLike}</Text>
                </View>
                <View style={{flex: 1}}>

                </View>
                <TouchableOpacity onPress={handleLikePost}>
                  {objectLike.liked ? 
                    (<Icon
                        name="thumbs-up"
                        color="#318bfb"
                        // backgroundColor="white"
                        style={{ marginRight: 5, fontSize: 20 }}>    
                    </Icon>
                    ) :
                    (
                      <Icon
                          name="thumbs-up"
                          color="#babec5"
                          // backgroundColor="white"
                          style={{ marginRight: 5, fontSize: 20 }}>    
                      </Icon>
                    )
                  } 
                </TouchableOpacity>
            </View>
            <View>
                {isLoading && 
                <View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20}}>
                    <Skeleton height={40} width={40} style={{borderRadius: 20}}/>
                    <Skeleton height={40} width={150} style={{borderRadius: 10, marginLeft: 10}}/>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20}}>
                    <Skeleton height={40} width={40} style={{borderRadius: 20}}/>
                    <Skeleton height={100} width={250} style={{borderRadius: 10, marginLeft: 10}}/>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20}}>
                    <Skeleton height={40} width={40} style={{borderRadius: 20}}/>
                    <Skeleton height={40} width={200} style={{borderRadius: 10, marginLeft: 10}}/>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20}}>
                    <Skeleton height={40} width={40} style={{borderRadius: 20}}/>
                    <Skeleton height={40} width={240} style={{borderRadius: 10, marginLeft: 10}}/>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20}}>
                    <Skeleton height={40} width={40} style={{borderRadius: 20}}/>
                    <Skeleton height={100} width={240} style={{borderRadius: 10, marginLeft: 10}}/>
                    </View>
                </View>
                }
                
                {!isLoading && isOffline && 
                <View style={styles.emptyValue}>
                    <Image 
                      source={require("../../assets/icon/empty-content.png")}
                      style={{ width: 100, height: 100 }}
                      resizeMode={"cover"}
                    />
                    <Text style={{fontWeight: "900"}}>Viết bình luận trong khi offline</Text>
                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={regetComment}>
                    <Image 
                        source={require("../../assets/icon/refresh-2-32.png")}
                        style={{ width: 10, height: 10 }}
                        resizeMode={"cover"}
                    />
                    <Text style={{color: "#babec5", marginLeft: 5}}>Nhấn để thử tải lại bình luận</Text>
                    </TouchableOpacity>
                </View>
                }
                {!isLoading && !isOffline && data.length > 0 && 
                  <ScrollView style={styles.scrollContent}>
                      <TouchableOpacity style={{paddingBottom: 10, paddingLeft: 5,}} onPress={handleGetMoreComment}>
                          <Text style={{fontWeight: "900"}}>Xem các bình luận trước...</Text>
                      </TouchableOpacity>
                      {data.map((comment, index) => (
                      <View key={index} style={styles.contentContainer}>
                          <Image
                              style={styles.avatar}
                              source={{uri: comment.avatar}}
                          />
                          <View>
                              <View style={styles.comment}>
                              <Text style={{fontWeight: "900"}}>{comment.author}</Text>
                              <Text>{comment.content}</Text>
                              </View>
                              <View style={styles.footerComment}>
                              <Text style={{paddingRight: 10}}>{comment.time}</Text>
                              <Text style={{paddingRight: 10}}>Thích</Text>
                              <Text style={{paddingRight: 10}}>Trả lời</Text>
                              </View>
                          </View>
                          
                      </View>

                      ))}
                  </ScrollView>
                }

                {!isLoading && !isOffline && data.length == 0 && 
                  <View style={styles.emptyValue}>
                    <Image 
                      source={require("../../assets/icon/empty-content.png")}
                      style={{ width: 100, height: 100 }}
                      resizeMode={"cover"}
                    />
                    <Text style={{fontWeight: "900"}}>Hãy là người đầu tiên bình luận bài viết</Text>
                  </View>
                }
                
            </View>
            <View style={styles.footer}>
            <Image 
                source={require("../../assets/icon/camera-6-32.png")}
                style={{ width: 25, height: 25, marginRight: 15 }}
                resizeMode={"cover"}
            />
            <TextInput 
              placeholder="Viết bình luận..."
              placeholderTextColor="#babec5"
              style={styles.textInput}
              onChangeText={newText=> setContentComment(newText)}
              value={contentComment}
              ref={(r) => inputRef = r as any}
            />
            <Image 
                source={require("../../assets/icon/smile-grey.png")}
                style={{ width: 25, height: 25, marginRight: 5}}
                resizeMode={"cover"}
            />
            {contentComment && 
              <TouchableOpacity onPress={handlePostComment}>
                <Image 
                  source={require("../../assets/icon/arrow-34-32-right-blue.png")}
                  style={{ width: 25, height: 25 }}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            }
            {!contentComment &&
              <Image 
                source={require("../../assets/icon/arrow-34-32-right.png")}
                style={{ width: 25, height: 25 }}
                resizeMode={"cover"}
              />
            }
            
            </View>
        </View>
      </GestureRecognizer>
        
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#fff',
    outline: 'none',
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#babec5",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 50,
  },
  contentContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  footerComment: {
    flexDirection: "row"
  },
  comment: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f1f2f6",

  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#babec5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    zIndex: 100,
    backgroundColor: "#fff",
  },
  textInput: {
    backgroundColor: "#f1f2f6",
    borderRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
    height: 45,
    paddingLeft: 15
  },
  emptyValue: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150
  },
});

export default Comment;
