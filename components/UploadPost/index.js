import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StatusBar,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, TextInput } from "react-native-paper";
import { useEffect, useState, useRef } from "react";
import BackNoti from "./BackNoti";
import EmojiAction from "./EmojiAction";

function UploadPost() {
  const inputRef = useRef();
  const [showFooter, setShowFooter] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [media, setMedia] = useState({
    hasMedia: true,
    numberImage: 3,
    numberVideo: 0,
    urlImage1: 'https://i.ibb.co/27xWkbV/story4.png',
    urlImage2: 'https://i.ibb.co/WsFZXtp/story1.png',
    urlImage3: 'https://i.ibb.co/Q6cF7Cm/story2.png',
    urlImage4: 'https://i.ibb.co/h1CkkfT/story3.png',
  })

  const [modalNotiVisible, setModalNotiVisible] = useState(false);
  const [modalEmojiVisible, setModalEmojiVisible] = useState(false);

  const onPressShowFooter = () => {
    if(!isFocus){
      setShowFooter(true);
    }
    else{
      setIsFocus(false);
      inputRef?.current?.blur();
    }
  }

  const onFocusInput = () => {
    setIsFocus(true);
    setShowFooter(false);
  }

  const onBack = () => {
    setModalNotiVisible(true);
  }

  const onContinueEdit = () => {
    setModalNotiVisible(false);
  }

  const onHiddenEmoji = () => {
    setModalEmojiVisible(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ marginTop: 2 }} onPress={onBack}>
          <Image
            source={require("../../assets/icon/arrow-121-32.png")}
            style={{ width: 15, height: 15 }}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
        <Text style={{ marginLeft: 10 }}>Tạo bài viết</Text>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity style={[styles.btnPost, styles.btnPostActive]}>
          <Text style={[styles.txtBtn, styles.txtBtnActive]}>Đăng</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 8,
              height: 70,
            }}
          >
            <TouchableOpacity style={styles.avatarContainer}>
              <Image
                resizeMode="cover"
                style={styles.avatar}
                source={require("../../assets/avatar/avatar4.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
              <View>
                <Text style={{ fontWeight: "600" }}>Trần Hà</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5Icon color="#babec5" name="globe-asia" />
                  <Text style={{ color: "#babec5", marginLeft: 5 }}>
                    Công khai
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              multiline={true}
              numberOfLines={6}
              editable
              placeholder="Bạn đang nghĩ gì?"
              placeholderTextColor="grey"
              underlineColor="transparent"
              style={[styles.textInput]}
              ref={inputRef}
              onFocus={onFocusInput}
            />
          </View>
          <View style={styles.contentMedia}>
            {media.hasMedia && (
              <View style={styles.layout}>
                {media.numberImage == 1 && (
                  <TouchableOpacity style={styles.oneImage}>
                    <ImageBackground
                      source={{uri: media.urlImage1}}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </TouchableOpacity>
                )}
                {media.numberImage == 2 && (
                  <View style={styles.twoImage}>
                    <TouchableOpacity style={{ width: '50%', marginRight: 5 }}>
                      <Image
                        source={{uri: media.urlImage1}}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode={'cover'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '50%' }}>
                      <Image
                        source={{uri: media.urlImage2}}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode={'cover'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {media.numberImage == 3 && (
                  <View style={[styles.twoImage, { overflow: 'hidden' }]}>
                    <TouchableOpacity style={{ width: '50%', marginRight: 5 }}>
                      <Image
                        source={{uri: media.urlImage1}}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode={'cover'}
                      />
                    </TouchableOpacity>
                    <View style={{ width: '50%' }}>
                      <TouchableOpacity
                        style={{ width: '100%', height: '50%', marginBottom: 5 }}>
                        <Image
                          source={{uri: media.urlImage2}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: '100%', height: '50%' }}>
                        <Image
                          source={{uri: media.urlImage3}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {media.numberImage == 4 && (
                  <View style={[styles.fourImage, { overflow: 'hidden' }]}>
                    <View
                      style={{
                        width: '100%',
                        height: '50%',
                        flexDirection: 'row',
                        marginBottom: 5,
                      }}>
                      <TouchableOpacity
                        style={{ width: '50%', height: '100%', marginRight: 5 }}>
                        <Image
                          source={{uri: media.urlImage1}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: '50%', height: '100%' }}>
                        <Image
                          source={{uri: media.urlImage2}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: '50%',
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={{ width: '50%', height: '100%', marginRight: 5 }}>
                        <Image
                          source={{uri: media.urlImage3}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: '50%', height: '100%' }}>
                        <Image
                          source={{uri: media.urlImage4}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {media.hasVideo && (
                  <View style={[styles.fourImage, { overflow: 'hidden' }]}>
                    <VideoPlayer
                      video={{ uri: 'https://vjs.zencdn.net/v/oceans.mp4' }}
                      style={{height: 250}}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
      </ScrollView>

      <View style={styles.footer}>
        {showFooter && 
          <View style={styles.verticalOption}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity style={styles.optionVertical}>
                <Image
                  resizeMode="cover"
                  style={styles.iconVertical}
                  source={require("../../assets/icon/image-2-32.png")}
                />
                <Text>Ảnh/Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionVertical} onPress={()=>{setModalEmojiVisible(true)}}>
                <Image
                  resizeMode="cover"
                  style={styles.iconVertical}
                  source={require("../../assets/icon/emoticon-24-32.png")}
                />
                <Text>Cảm xúc/Hoạt động</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        
        }

        {!showFooter && 
          <View style={styles.horizontalOption}>
            <View style={{flex: 1}}>
              <Text>Thêm vào bài viết của bạn</Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity>
                  <Image
                    resizeMode="cover"
                    style={styles.iconVertical}
                    source={require("../../assets/icon/image-2-32.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setModalEmojiVisible(true)}}>
                  <Image
                    resizeMode="cover"
                    style={styles.iconVertical}
                    source={require("../../assets/icon/emoticon-24-32.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressShowFooter}>
                  <View style={[styles.iconVertical, {backgroundColor: "#babec5", borderRadius: 50, alignItems: "center"}]}>
                    <Text>...</Text>
                  </View>
                </TouchableOpacity>
                
            </View>
          </View>
        }

      </View>

      <BackNoti  visible={modalNotiVisible} handleEventShow={onContinueEdit}/>
      <EmojiAction  visible={modalEmojiVisible} handleEventShow={onHiddenEmoji}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#babec5",
  },
  btnPost: {
    height: 35,
    backgroundColor: "#babec5",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },

  btnPostActive: {
    backgroundColor: "#528eef",
  },
  txtBtnActive: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    backgroundColor: "#fff",
  },
  avatar: {
    width: 45,
    height: 45,
    marginRight: 10,
    borderRadius: 50,
  },
  textInput: {
    textAlignVertical: "top",
    backgroundColor: "#fff",
    fontSize: 20,
    minHeight: 50,
  },
  contentMedia: {
    width: "100%",
    backgroundColor: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  verticalOption: {
    flexDirection: "column",
    backgroundColor: '#fff',
  },
  optionVertical: {
    flexDirection: "row", 
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#babec5",
  },
  btnVerticalOption: {
    width: 30,
    height: 25,
    alignItems: 'center'
  },
  iconVertical: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  horizontalOption: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#babec5",
    backgroundColor: '#fff',
  },
  layout: {
    height: 400,
    display: 'flex',
    marginBottom: 5
  },
  oneImage: {
    flex: 1,
    backgroundColor: 'red',
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
});

export default UploadPost;
