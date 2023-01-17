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
  TextInput
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import FormData from 'form-data'
import { useEffect, useState, useRef } from "react";
import BackNoti from "./BackNoti";
import EmojiAction from "./EmojiAction";
import GalleryImage from "./GalleryImage"
import axios from "axios";
import fetch, { Headers, RequestInit } from "node-fetch";

interface IUserInfo {
  userId? : string,
  userName? : string,
  urlAvatar? : string,
}

const userId = "63bb01635d6413842cdb10d8";
const MAX_SELECTED_IMAGEs = 4;
const MAX_SELECTED_VIDEOs = 1;
const MAX_VIDEO_SIZE = 20000000; //(Bytes)
const MAX_IMAGE_SIZE = 4194000; //(Bytes)
const acessType = ["jpeg", "jpg", "png"];


function UploadPost({route}: any) {
  const mode = route.params.mode;
  let inputRef = useRef<TextInput>(null);
  const [showFooter, setShowFooter] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [media, setMedia] = useState({
    hasMedia: true,
    numberImage: 0,
    numberVideo: 0,
    urlImage: [] as string[],
  })

  const [described, setDescribed] = useState<string>("");
  const [numCurImage, setNumCurImage] = useState(0)
  const [modalNotiVisible, setModalNotiVisible] = useState(false);
  const [modalEmojiVisible, setModalEmojiVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfo>({});
  const [galleryImage, setGalleryImage] = useState<MediaLibrary.Asset[]>([])
  const [showGalleryImage, setShowGalleryImage] = useState(false);
  const [lstImageSelected, setLstImageSelected] = useState<number[]>([]);
  const [lstCurImage, setLstCurImage] = useState<string[]>([]);
  const [lstCurImageId, setLstCurImageId] = useState<string[]>([]);
  const [lstCurImageIdDelete, setLstCurImageIdDelete] = useState<string[]>([]);
  const [status, setStatus] = useState<string>();
  const [uploadActive, setUploadActive] = useState<boolean>(false);

  useEffect(() => {
    getUserInfo();
  }, [])


  useEffect(() => {
    if(described || media.numberImage > 0){
      setUploadActive(true);
    }
    else{
      setUploadActive(false);
    }
  }, [described, media.numberImage])

  const getUserInfo = async () => {
    await axios.post("/user/get_user_info?user_id="+userId)
      .then((userInfo)=>{
        const user = userInfo.data.data;
        const info = {
          userId: userId,
          userName: user.username,
          urlAvatar: user.avatar,
        }
        
        setUserInfo(info);
      })
      .catch((err)=>{
      })
  }

  const getData = async () => {
    if(mode == 2){
      const id = route.params.id;
      await axios.post("/post/get_post?id=" + id)
      .then((data)=>{

      })
      .catch((err)=>{

      })
    }

  }

  const onPressShowFooter = () => {
    if(!isFocus){
      setShowFooter(true);
    }
    else{
      setIsFocus(false);
      (inputRef?.current as any)?.blur();
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

  const onHiddenGallery = () => {
    setShowGalleryImage(false)
  }

  const handlePickupImage = async () => {
    return Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      .then(() => {
        var lastDate = new Date('2018-01-01')
        return MediaLibrary.getAssetsAsync({ first: 500, mediaType: "photo", createdAfter: lastDate.getTime(), sortBy: 'creationTime' });
      })
      .then((result) => {
        setGalleryImage(result.assets);
        setShowGalleryImage(true)
      });
  }

  const handleSelectedImage = (lstIndex : [number]) => {
    var checkValidType = true;
    var lstIndexd = lstIndex.filter(function(item, pos) {
      return lstIndex.indexOf(item) == pos;
    })
    for(var i=0; i<lstIndexd.length; i++){
      var index = lstIndexd[i];
      var image = galleryImage[index];
      var type = image.filename.split(".");
      var t = type[type.length - 1];
      if(!acessType.includes(t.toLocaleLowerCase())){
        alert("Bạn chỉ được upload ảnh có định dạng jpeg, jpg, png.");
        checkValidType = false;
        break;
      }
      if((image.height * image.width * 4) > MAX_IMAGE_SIZE){
        alert("Bạn chỉ được upload ảnh có kích thước tối đa là 4MB!");
        checkValidType = false;
        break;
      }
    }
    if(checkValidType){
      setLstImageSelected(lstIndexd);
      setValueForImage(lstIndexd, lstCurImage)
    }
    else{
      setLstImageSelected([...lstImageSelected]);
    }
  }

  const handleDeleteImage = (index : number) => {
    if(lstCurImage.length > 0){
      if(index < lstCurImage.length){
        var images = lstCurImage;
        images.splice(index, 1);
        setLstCurImage([...images]);

        var idImages = lstCurImageId;
        var idImage = idImages.splice(index, 1);
        setLstCurImageId([...idImages]);

        setLstCurImageIdDelete([...lstCurImageIdDelete, ...idImage]);
        setValueForImage(lstImageSelected, lstCurImage);
      }
      else{
        var indexDelete = index - lstCurImage.length;
        var lstImage = lstImageSelected;
        lstImage.splice(indexDelete, 1);
        setValueForImage(lstImage, lstCurImage);
        setLstImageSelected([...lstImage]);
      }
    }
    else{
      var lstImage = lstImageSelected;
      lstImage.splice(index, 1);
      setValueForImage(lstImage, lstCurImage);
      setLstImageSelected([...lstImage]);
    }
  }

  const setValueForImage = (lstImage : any, lstCurImage : any) => {
    var uriImages = [];
    for(var i=0; i<lstImage.length; i++){
      var index = lstImage[i];
      var image = galleryImage[index];
      uriImages.push(image.uri);
    }
    var dataMedia = media;
    dataMedia.urlImage = [...lstCurImage, ...uriImages];
    dataMedia.numberImage = dataMedia.urlImage.length;
    setMedia(dataMedia);
  }

  const handleChooseEmoji = (emoji: string) => {
    setStatus(emoji);
  }

  const saveData = async () => {
    var formData = new FormData();
    for(var i=0; i<lstImageSelected.length; i++){
      var index = lstImageSelected[i];
      var image = galleryImage[index];
      var type = image.filename.split(".");
      var t = type[type.length - 1];
      var imageReal = {
        "uri": image.uri,
        "name": image.filename,
        "type": "image/"+t
      }
      formData.append("image", imageReal);
    }

    if(mode == 1){
      const requestOptions: RequestInit = {
        method: "POST",
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }),
        body: formData
      };
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzQxNzcwOTgxNTJmZjUzYjI2MDgwOCIsImRhdGVMb2dpbiI6IjIwMjMtMDEtMTVUMTU6MTQ6MjQuMjAxWiIsImlhdCI6MTY3Mzc5NTY2NCwiZXhwIjoxNjgzNzk1NjYzfQ.yb9UTj6WJpo42IYqdeTMgjhzGrbbwcI4Fz5mvL_27fs";
      var uri = "";
      if(described && status){
        uri = 'http://184.169.213.180:3000/it4788/post/add_post?token='+token+'&described='+described+'&status='+status;
      }
      else if(described && !status){
        uri = 'http://184.169.213.180:3000/it4788/post/add_post?token='+token+'&described='+described;
      }
      else if(!described && status){
        uri = 'http://184.169.213.180:3000/it4788/post/add_post?token='+token+'&status='+status;
      }
      else{
        uri = 'http://184.169.213.180:3000/it4788/post/add_post?token='+token;
      }
      
      fetch(uri, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    else{
      
    }
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
        {uploadActive ? 
          (<TouchableOpacity style={[styles.btnPost, styles.btnPostActive]} onPress={saveData}>
            <Text style={[ styles.txtBtnActive]}>Đăng</Text>
          </TouchableOpacity>)
          : (<View style={[styles.btnPost]} >
            <Text style={[ styles.txtBtnActive]}>Đăng</Text>
          </View>)
        }
        
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
            <TouchableOpacity>
              <Image
                resizeMode="cover"
                style={styles.avatar}
                source={{uri: userInfo.urlAvatar}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
              <View>
                <Text style={{ fontWeight: "600" }}>{userInfo.userName}</Text>
                {status && (
                  <Text>Đang cảm thấy <Text style={{fontWeight: "600"}}>{status}</Text></Text>
                )}
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
              value={described}
              style={[styles.textInput]}
              ref={(r) => inputRef = r as any}
              onFocus={onFocusInput}
              onChangeText={(text : any)=>{setDescribed(text)}}
            />
          </View>
          <View style={styles.contentMedia}>
            {media.hasMedia && (
              <View style={styles.layout}>
                {media.numberImage == 1 && (
                  <View style={styles.oneImage}>
                    <ImageBackground
                      source={{uri: media.urlImage[0]}}
                      style={{ width: '100%', height: '100%' }}
                    />
                    <TouchableOpacity 
                      style={styles.deleteImage}
                      onPress={()=>{handleDeleteImage(0)}}
                    >
                      <Text style={{color: "#000", fontSize: 20}}>X</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {media.numberImage == 2 && (
                  <View style={styles.twoImage}>
                    <View style={{ width: '50%', marginRight: 5, position: "relative" }}>
                      <Image
                        source={{uri: media.urlImage[0]}}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode={'cover'}
                      />
                      <TouchableOpacity 
                        style={styles.deleteImage}
                        onPress={()=>{handleDeleteImage(0)}}
                      >
                        <Text style={{color: "#000", fontSize: 20}}>X</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: '50%', position: "relative" }}>
                      <Image
                        source={{uri: media.urlImage[1]}}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode={'cover'}
                      />
                      <TouchableOpacity 
                        style={styles.deleteImage}
                        onPress={()=>{handleDeleteImage(1)}}
                      >
                        <Text style={{color: "#000", fontSize: 20}}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {media.numberImage == 3 && (
                  <View style={[styles.twoImage, { overflow: 'hidden' }]}>
                    <View style={{ width: '50%', marginRight: 5, position: "relative" }}>
                      <Image
                        source={{uri: media.urlImage[0]}}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode={'cover'}
                      />
                      <TouchableOpacity 
                        style={styles.deleteImage}
                        onPress={()=>{handleDeleteImage(0)}}
                      >
                        <Text style={{color: "#000", fontSize: 20}}>X</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: '50%' }}>
                      <View
                        style={{ width: '100%', height: '50%', marginBottom: 5, position: "relative" }}>
                        <Image
                          source={{uri: media.urlImage[1]}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                        <TouchableOpacity 
                          style={styles.deleteImage}
                          onPress={()=>{handleDeleteImage(1)}}
                        >
                          <Text style={{color: "#000", fontSize: 20}}>X</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: '100%', height: '50%', position: "relative" }}>
                        <Image
                          source={{uri: media.urlImage[2]}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                        <TouchableOpacity 
                          style={styles.deleteImage}
                          onPress={()=>{handleDeleteImage(2)}}
                        >
                          <Text style={{color: "#000", fontSize: 20}}>X</Text>
                        </TouchableOpacity>
                      </View>
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
                      <View
                        style={{ width: '50%', height: '100%', marginRight: 5, position: "relative" }}>
                        <Image
                          source={{uri: media.urlImage[0]}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                        <TouchableOpacity 
                          style={styles.deleteImage}
                          onPress={()=>{handleDeleteImage(0)}}
                        >
                          <Text style={{color: "#000", fontSize: 20}}>X</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: '50%', height: '100%', position: "relative" }}>
                        <Image
                          source={{uri: media.urlImage[1]}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                        <TouchableOpacity 
                          style={styles.deleteImage}
                          onPress={()=>{handleDeleteImage(1)}}
                        >
                          <Text style={{color: "#000", fontSize: 20}}>X</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: '50%',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{ width: '50%', height: '100%', marginRight: 5, position: "relative" }}>
                        <Image
                          source={{uri: media.urlImage[2]}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                        <TouchableOpacity 
                          style={styles.deleteImage}
                          onPress={()=>{handleDeleteImage(2)}}
                        >
                          <Text style={{color: "#000", fontSize: 20}}>X</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: '50%', height: '100%', position: "relative" }}>
                        <Image
                          source={{uri: media.urlImage[3]}}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode={'cover'}
                        />
                        <TouchableOpacity 
                          style={styles.deleteImage}
                          onPress={()=>{handleDeleteImage(3)}}
                        >
                          <Text style={{color: "#000", fontSize: 20}}>X</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
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
              <TouchableOpacity style={styles.optionVertical} onPress={handlePickupImage}>
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
                <TouchableOpacity onPress={handlePickupImage}>
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
      <EmojiAction  
        visible={modalEmojiVisible} 
        handleEventShow={onHiddenEmoji} 
        handleChooseEmoji={handleChooseEmoji}
        emoji={status}
      />
      <GalleryImage 
        visible={showGalleryImage} 
        handleEventShow={onHiddenGallery}
        data={galleryImage}
        numberImage={numCurImage}
        lstSelected={lstImageSelected}
        callBackEvent={handleSelectedImage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
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
    position: "relative",
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
    position: "relative"
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
  deleteImage: {
    height: 30, 
    width: 30, 
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    backgroundColor: "#babec5",
    borderRadius: 50
  }
});

export default UploadPost;
