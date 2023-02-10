import React, { Component, useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Button, StatusBar, TouchableOpacity, TouchableHighlight, ActivityIndicator, Pressable } from "react-native";
import axios from "axios";
import { useStore } from "../store";
import GalleryImage from "../components/UploadPost/GalleryImage";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { SCREEN_WIDTH } from "../constants";
import * as mime from "mime";

/**
 * I write a litte util method to convert localIdentifier to assetURL in JavaScript
 * @param localIdentifier looks like 91B1C271-C617-49CE-A074-E391BA7F843F/L0/001
 * @param ext the extension: JPG, PNG, MOV
 * @returns {string}
 */
export const convertLocalIdentifierToAssetLibrary = (localIdentifier, ext) => {
  const hash = localIdentifier.split('/')[0];
  return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
};
const acessType = ["jpeg", "jpg", "png"];
const MAX_IMAGE_SIZE = 4194000;
const ChangeInfoUser = ({ navigation, route }: any) => {
  const token = route.params.token;
  const phoneNumber = route.params.phoneNumber;
  const [username, setUserName] = React.useState("");
  const [galleryImage, setGalleryImage] = useState<MediaLibrary.Asset[]>([])
  const [showGalleryImage, setShowGalleryImage] = useState(false);
  const [lstImageSelected, setLstImageSelected] = useState<number[]>([]);
  const [idImage, setIdImage] = useState(0);
  const [invalid, setInvalid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);


  const { state, dispatch } = useStore();


  const handleLogin = async () => {
    try {
      const formData = new FormData();
      if (!!galleryImage?.[idImage]) {
        let temp = galleryImage?.[idImage].uri;
        var type = temp.split(".");
        var t = type[type.length - 1];

        var rt = {
          "uri": temp,
          "name": temp.substring(temp.lastIndexOf('/') + 1, temp.length),
          "type": "image/png"
        }

        formData.append("avatar", rt as any);
        console.log(mime.getExtension(temp))
        console.log(galleryImage?.[idImage])
      }
      
      // setInvalid(false);
      // setLoading(true);
      const res = await axios.post(`/auth/change_info_after_signup?username=${username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: "LOGIN", payload: { ...res.data?.data, token } })
      // setLoading(false);
    } catch (error) {
      console.log(error)
      // setInvalid(true);
      // setLoading(false);
    }


  };

  const handleSelectedImage = (lstIndex: [number], type_image: number) => {
    let checkValidType = true;
    const lstIndexd = lstIndex.filter(function (item, pos) {
      return lstIndex.indexOf(item) == pos;
    })
    var image = galleryImage[lstIndexd[0]];
    var type = image.filename.split(".");
    var t = type[type.length - 1];
    if (!acessType.includes(t.toLocaleLowerCase())) {
      alert("Bạn chỉ được upload ảnh có định dạng jpeg, jpg, png.");
      checkValidType = false;
    }
    if ((image.height * image.width * 4) > MAX_IMAGE_SIZE) {
      alert("Bạn chỉ được upload ảnh có kích thước tối đa là 4MB!");
      checkValidType = false;
    }
    setIdImage(lstIndexd[0]);
    if (!checkValidType) {
      setGalleryImage([]);
    }

  }

  const handleUploadImage = () => {
    return Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      .then(() => {
        var lastDate = new Date('2018-01-01')
        return MediaLibrary.getAssetsAsync({ first: 500, mediaType: "photo", createdAfter: lastDate.getTime(), sortBy: 'creationTime' });
      })
      .then((result) => {
        setGalleryImage(result.assets);
        setShowGalleryImage(true);
        setLstImageSelected([])
      });
  }

  return (
    <ScrollView>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#30477C"
        translucent={true}
      />
      <View style={styles.container}>
        <View style={styles.banner}>
          <Image
            style={(false) ? styles.WithoutBanner : styles.bannerImg}
            source={(false) ? require("../assets/facebookLogo.png") : require("../assets/banner.png")}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.lang}>
            <TouchableOpacity>
              {/* <Text onPress={this.englishLang}>
                {this.state.lang} •
              </Text> */}
            </TouchableOpacity>
            <Text>Ngôn ngữ • </Text>
            <TouchableHighlight>
              <TouchableHighlight
              // onPress={() => {
              //   this.setModalVisible(true);
              // }}
              >
                <Text>Việt Nam</Text>
              </TouchableHighlight>
            </TouchableHighlight>
          </View>
          <View style={styles.textInput}>
            <TextInput
              style={styles.formInput}
              placeholder={"Nhập tên"}
              onChangeText={userName =>
                setUserName(userName)
              }
            />

          </View>
          <View style={{ position: "relative", height: 200 }}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity activeOpacity={0.9}>
                <Image style={styles.avatar} source={{ uri: galleryImage?.[idImage]?.uri ?? undefined }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnChangeAvatar} onPress={() => handleUploadImage()}>
                <FontAwesome5Icon size={18} name="camera" />
              </TouchableOpacity>
            </View>
          </View>
          {invalid && <View>
            <Text style={styles.validate}>Thông tin không đúng</Text>

          </View>}
          <Pressable style={styles.loginButton} disabled={loading}
            onPress={() => handleLogin()}>
            <Text style={{ color: "#fff" }}>{loading ? <ActivityIndicator /> : "Cập nhật thông tin cá nhân"}</Text>
          </Pressable>

        </View>
      </View>
      <GalleryImage
        visible={showGalleryImage}
        handleEventShow={() => setShowGalleryImage(false)}
        data={galleryImage}
        numberImage={1}
        lstSelected={lstImageSelected}
        callBackEvent={handleSelectedImage}
        screen={"ChangeInfoAfterRegister"}
        type_image={0}
      />
    </ScrollView>
  );
}

export default ChangeInfoUser;

const styles = StyleSheet.create({
  validate: {
    color: "red"
  },
  container: {
    flex: 1
  },
  banner: {
    flex: 1.7
  },
  content: {
    flex: 3,
    marginHorizontal: 20
  },
  bannerImg: {
    height: 184,
    width: "100%"
  },
  WithoutBanner: {
    height: 72,
    width: 73,
    marginLeft: 120,
    marginTop: 40,
    marginBottom: 10
  },
  lang: {
    paddingTop: 10,
    color: "#707276",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  textInput: {
    marginTop: 20
  },
  formInput: {
    height: 40,
    borderBottomColor: "#ECEAEC",
    borderBottomWidth: 1,
    marginBottom: 10
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#0084FF",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    height: 40
  },
  textForgot: {
    marginTop: 20,
    textAlign: "center"
  },
  signOutButton: {
    marginTop: 25,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  orTextContainer: {
    flexDirection: "row",
    marginTop: 20
  },
  orTextLine: {
    width: "45%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  orText: {
    width: "10%",
    paddingLeft: 2,
    marginBottom: -6
  },
  avatarWrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    borderRadius: 2000,
    left: (SCREEN_WIDTH - 30 - 180) / 2, //paddingHorizontal - avatarWidth
    // top: 100 

  },
  avatar: {
    height: 180,
    width: 180,
    borderRadius: 2000,
    borderColor: '#fff',
    borderWidth: 5
  },

  btnChangeAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 50,
    width: 45,
    height: 45,
    borderWidth: 2.5,
    borderColor: '#fff',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
  },
});