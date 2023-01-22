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
  TextInput,
  BackHandler,
  Alert
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
import { getData, getDataObject, IUser, storeDataObject, removeDataStore} from '../../store';
import LottieView from 'lottie-react-native';


const MAX_SELECTED_IMAGEs = 4;
const MAX_SELECTED_VIDEOs = 1;
const MAX_VIDEO_SIZE = 20000000; //(Bytes)
const MAX_IMAGE_SIZE = 4194000; //(Bytes)
const acessType = ["jpeg", "jpg", "png"];

interface IQueryString { token: string, described?: string, status?: string }
interface IQueryStringUpdate { token: string, id: string, described?: string, status?: string, image_del: string}

function UploadPost(props: any) {
  const { navigation, route } = props;
  const mode = route.params.mode;
  const id = route.params.id;
  let inputRef = useRef<TextInput>(null);
  const [showFooter, setShowFooter] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [media, setMedia] = useState({
    hasMedia: true,
    numberImage: 0,
    numberVideo: 0,
    urlImage: [] as string[],
  })

  const [token, setToken] = useState<string>();
  const [described, setDescribed] = useState<string>("");
  const [numCurImage, setNumCurImage] = useState(0)
  const [modalNotiVisible, setModalNotiVisible] = useState(false);
  const [modalEmojiVisible, setModalEmojiVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<IUser>();
  const [galleryImage, setGalleryImage] = useState<MediaLibrary.Asset[]>([])
  const [showGalleryImage, setShowGalleryImage] = useState(false);
  const [lstImageSelected, setLstImageSelected] = useState<number[]>([]);
  const [lstCurImage, setLstCurImage] = useState<string[]>([]);
  const [lstCurImageId, setLstCurImageId] = useState<string[]>([]);
  const [lstCurImageIdDelete, setLstCurImageIdDelete] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [uploadActive, setUploadActive] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [oldDescribed, setOldDescribed] = useState<string>("");
  const [oldStatus, setOldStatus] = useState<string>("");
  const [oldMedia, setOldMedia] = useState({
    hasMedia: true,
    numberImage: 0,
    numberVideo: 0,
    urlImage: [] as string[],
  })

  useEffect(() => {
    getUserInfo();
    getToken();
    if(mode == 2){
      getDataPost();
    }
    else{
      getCachePost();
    }
  }, [])

  useEffect(() => {
    if(described || media.numberImage > 0){
      setUploadActive(true);
    }
    else{
      setUploadActive(false);
    }
  }, [described, media.numberImage])

  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [described, status, media, oldDescribed, oldStatus, oldMedia]);

  const getUserInfo = () => {
    getDataObject("user").then(user => {
      setUserInfo(user);
    })
  }

  const getToken = () => {
    getData("token").then(token => {
      setToken(token as string);
    }).catch(() => {
      //Go to login
    })
  }

  const getDataPost = async () => {
    setLoader(true);
    await axios.post("/post/get_post?id=" + id)
    .then((res)=>{
      const data = res.data.data;
      setDescribed(data.described);
      setStatus(data.state);
      var mediaData = {
        hasMedia: true,
        numberImage: (data.image) ? data.image.length : 0,
        numberVideo: 0,
        urlImage: (data.image) ? data.image.map((image : any, index: number)=>{return image.url}) : [],
      }
      var curImageId = (data.image) ? data.image.map((image : any, index: number)=>{return image.id}) : [];
      setMedia(mediaData);
      setNumCurImage(mediaData.numberImage);
      setLstCurImage(mediaData.urlImage);
      setLstCurImageId(curImageId);

      setOldDescribed(data.described);
      setOldStatus(data.state);
      setOldMedia(mediaData);
    })
    .catch((err)=>{
      console.log(err);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    })
    setLoader(false);
  }

  const getCachePost = async () => {
    setLoader(true);
    await getDataObject("newPost").then(obj => {
      if(obj){
        setDescribed(obj.described);
        setStatus(obj.status);
        setMedia(obj.media);
        setLstCurImage(obj.lstCurImage);
        setNumCurImage(obj.numCurImage);
        setLstImageSelected(obj.lstImageSelected);
      }
    })
    setLoader(false);
    removeDataStore("newPost");
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
  
  const checkChangeData = () => {
    var change = false;
    if(described != oldDescribed || status != oldStatus ||
      JSON.stringify(media) != JSON.stringify(oldMedia)){
        change = true;
      }

    return change;
  }

  const onBack = () => {
    if(checkChangeData()){
      if(mode == 2){
        Alert.alert('Bỏ thay đổi', 'Nếu bỏ bây giờ thì bạn sẽ mất mọi thay đổi trên bài viết này.', [
          {
            text: 'Chỉnh sửa tiếp',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Bỏ', onPress: () => navigation.goBack()},
        ]);
      }
      else{
        setModalNotiVisible(true);
      }
    }
    else{
      navigation.goBack();
    }
    
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

  const onSaveTempPost = async () => {
    var object = {
      described: described,
      status: status,
      media: media,
      lstCurImage: lstCurImage,
      numCurImage: numCurImage,
      lstImageSelected: lstImageSelected
    }
    await storeDataObject("newPost", object);
    navigation.goBack();
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
    for(var i=0; i<lstCurImage.length; i++){
      var item = lstCurImage[i];
      var type = item.split(".");
      var t = type[type.length - 1].split("?")[0];
      var imageReal = {
        "uri": item,
        "name": "filename_"+i,
        "type": "image/"+t
      }
      formData.append("image", imageReal);
    }

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

    var requestOptions: RequestInit = {
      method: "POST",
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }),
      body: formData
    };

    if(lstImageSelected.length == 0 && lstCurImage.length == 0){
      delete requestOptions["body"]; 
      requestOptions["headers"] = new Headers({
        'Content-Type': 'application/json',
      })
    }

    var uri = "";

    if(mode == 1){
      uri = "http://184.169.213.180:3000/it4788/post/add_post?";
      const modal = {} as IQueryString;
      modal.token = token!;
      modal.described = (described) ? described : '';
      modal.status = (status) ? status : '';
      let queryString = new URLSearchParams({...modal}).toString();
      uri = uri + queryString;
      
    }
    else{
      uri = "http://184.169.213.180:3000/it4788/post/edit_post?";
      const modalUpdate = {} as IQueryStringUpdate;
      modalUpdate.token = token!;
      modalUpdate.id = id!;
      modalUpdate.described = (described) ? described : '';
      modalUpdate.status = (status) ? status : '';
      modalUpdate.image_del = (lstCurImageIdDelete.length > 0) ? JSON.stringify(lstCurImageIdDelete): '';
      let queryString = new URLSearchParams({...modalUpdate}).toString();
      uri = uri + queryString;

      console.log(queryString)
    }
    setLoader(true);
    fetch(uri, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setLoader(false);
        route.params.onGoBack();
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoader(false);
        alert("Có lỗi xảy ra! Vui lòng thử lại");
      });
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
                source={{uri: userInfo?.avatar}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
              <View>
                <Text style={{ fontWeight: "600" }}>{userInfo?.name}</Text>
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

      <BackNoti  
        visible={modalNotiVisible} 
        handleEventShow={onContinueEdit}
        callBackSave={onSaveTempPost}
        navigation={navigation}
      />
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
      {loader && <LottieView source={require('../../assets/icon/loader.json')} autoPlay loop />}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: StatusBar.currentHeight,
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
