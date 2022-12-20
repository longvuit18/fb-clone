import React, { useState, useEffect } from 'react';
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
  BackHandler,
  Alert, 
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Skeleton from '../Skeleton';

function Comment({ visible, handleEventShow }: any) {
  const [modalVisible, setModalVisible] = useState(visible);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(false);
  }

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const handleBackButtonClick = () => {
    hiddenModal();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  const lstComment = [
    {
      avatar: "https://i.ibb.co/5kDFTz5/avatar4.png",
      author: "Trần Hà",
      content: "Test bình luận 1",
      time: "1 ngày",
    },
    {
      avatar: "https://i.ibb.co/WsFZXtp/story1.png",
      author: "Vũ Trang",
      content: "Test bình luận 2",
      time: "1 ngày",
    },
    {
      avatar: "https://i.ibb.co/Q6cF7Cm/story2.png",
      author: "Minh Quang",
      content: "Test bình luận 3",
      time: "1 ngày",
    }
  ]

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
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
                    <Text style={{fontWeight: "900"}}>190</Text>
                </View>
                <View style={{flex: 1}}>

                </View>
                <TouchableOpacity>
                    <Icon
                        name="thumbs-up"
                        color="#318bfb"
                        // backgroundColor="white"
                        style={{ marginRight: 5, fontSize: 20 }}>    
                    </Icon>
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
                      source={require("../../../assets/icon/empty-content.png")}
                      style={{ width: 100, height: 100 }}
                      resizeMode={"cover"}
                    />
                    <Text style={{fontWeight: "900"}}>Viết bình luận trong khi offline</Text>
                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
                      <Image 
                        source={require("../../../assets/icon/refresh-2-32.png")}
                        style={{ width: 10, height: 10 }}
                        resizeMode={"cover"}
                      />
                      <Text style={{color: "#babec5", marginLeft: 5}}>Nhấn để thử tải lại bình luận</Text>
                    </TouchableOpacity>
                  </View>
                }
                {!isLoading && !isOffline && lstComment.length > 0 && 
                  <ScrollView style={styles.scrollContent}>
                    <TouchableOpacity style={{paddingBottom: 10, paddingLeft: 5,}}>
                        <Text style={{fontWeight: "900"}}>Xem các bình luận trước...</Text>
                    </TouchableOpacity>
                    {lstComment.map((comment, index) => (
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
                
            </View>
            <View style={styles.footer}>
              <Image 
                source={require("../../../assets/icon/camera-6-32.png")}
                style={{ width: 25, height: 25, marginRight: 15 }}
                resizeMode={"cover"}
              />
              <TextInput 
              placeholder="Viết bình luận..."
              placeholderTextColor="#babec5"
              // underlineColor="transparent"
              style={styles.textInput}
              />
              <Image 
                source={require("../../../assets/icon/gif-32.png")}
                style={{ width: 25, height: 25, marginRight: 5 }}
                resizeMode={"cover"}
              />
              <Image 
                source={require("../../../assets/icon/smile-grey.png")}
                style={{ width: 25, height: 25}}
                resizeMode={"cover"}
              />
            </View>
        </View>
        
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  emptyValue: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150
  },
});

export default Comment;
