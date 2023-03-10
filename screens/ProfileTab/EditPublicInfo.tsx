import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput, Alert, Pressable } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { BASE_URL, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
// import ExTouchableOpacity from '../../components/ExTouchableOpacity'
import { useEffect, useState, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import GalleryImage from "../../components/UploadPost/GalleryImage"
import { getData, getDataObject, IUser, IUserInfo, userInfoInitData, useStore } from '../../store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const acessType = ["jpeg", "jpg", "png"];
const MAX_IMAGE_SIZE = 4194000; //(Bytes)

interface IQueryString { token: string, username: string, description: string, address: string, city: string, country: string, link: string }

export default function EditPublicInfo({ route }: any) {
  const userInfo_1 = route.params.user as IUserInfo ?? userInfoInitData;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(() => userInfo_1);
  const [galleryImage, setGalleryImage] = useState<MediaLibrary.Asset[]>([])
  const [showGalleryImage, setShowGalleryImage] = useState(false);
  const [lstImageSelected, setLstImageSelected] = useState<number[]>([]);
  const [localAvatar, setLocalAvatar] = useState("");
  const [localCoverImage, setLocalCoverImage] = useState("");
  const [typeImage, setTypeImage] = useState(0)
  const { dispatch } = useStore();

  const onHiddenGallery = () => {
    setShowGalleryImage(false)
  }

  const setValueForImage = (lstImage: any, type_image: number) => {
    if (lstImage.length > 0) {
      var image = galleryImage[lstImage[0]];

      var user = userInfo;
      if (type_image == 0) {
        // user.avatar = image.uri;
        setLocalAvatar(image.uri);
        // console.log(image.uri)
      } else {
        // user.cover_image = image.uri;
        setLocalCoverImage(image.uri);
      }

      setUserInfo({ ...user })
    }
  }

  const handleSelectedImage = (lstIndex: [number], type_image: number) => {
    var checkValidType = true;
    var lstIndexd = lstIndex.filter(function (item, pos) {
      return lstIndex.indexOf(item) == pos;
    })
    var image = galleryImage[lstIndexd[0]];
    var type = image.filename.split(".");
    var t = type[type.length - 1];
    if (!acessType.includes(t.toLocaleLowerCase())) {
      alert("B???n ch??? ???????c upload ???nh c?? ?????nh d???ng jpeg, jpg, png.");
      checkValidType = false;
    }
    if ((image.height * image.width * 4) > MAX_IMAGE_SIZE) {
      alert("B???n ch??? ???????c upload ???nh c?? k??ch th?????c t???i ??a l?? 4MB!");
      checkValidType = false;
    }
    if (checkValidType) {
      setLstImageSelected(lstIndexd);
      setValueForImage(lstIndexd, type_image)
    }
    else {
      setLstImageSelected([...lstImageSelected]);
    }
  }


  const saveData = async () => {
    const formData = new FormData();
    if (localAvatar) {

      const type = localAvatar.split(".");
      const t = type[type.length - 1];

      var rt = {
        "uri": localAvatar,
        "name": localAvatar.substring(localAvatar.lastIndexOf('/') + 1, localAvatar.length) + Date.now(),
        "type": "image/" + t
      }

      formData.append("avatar", rt as any);
    }

    if (localCoverImage) {
      const type = localCoverImage.split(".");
      const t = type[type.length - 1];

      const rt = {
        "uri": localCoverImage,
        "name": localCoverImage.substring(localCoverImage.lastIndexOf('/') + 1, localCoverImage.length) + Date.now(),
        "type": "image/" + t
      }

      formData.append("cover_image", rt as any);
    }

    // if (formData.getAll.length <= 1) {
    //   delete requestOptions["body"];
    //   requestOptions["headers"] = new Headers({
    //     'Content-Type': 'application/json',
    //   })
    // }

    let uri = `/user/set_user_info?`;
    const modal = {} as IQueryString;
    modal.username = userInfo.username ?? "";
    modal.description = userInfo.description ?? "";
    modal.address = userInfo.address ?? "";
    modal.city = userInfo.city ?? "";
    modal.country = userInfo.country ?? "";
    modal.link = "";
    let queryString = new URLSearchParams({ ...modal }).toString();
    uri = uri + queryString;
    setLoading(true);

    try {
      let res;
      if (!!localAvatar || !!localCoverImage) {
        res = await axios.post(uri, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        res = await axios.post(uri, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      }

      console.log(res.data.data)
      dispatch({ type: "UPDATE_USER_INFO", payload: { userInfo: res.data.data } })
      Alert.alert('Th??ng b??o', 'C???p nh???t th??ng tin th??nh c??ng', [
        {
          text: 'OK', onPress: () => {
            navigation.goBack();
          }
        },
      ]);
    } catch (error) {
      console.error('Error:', error.response.data);
    } finally {
      setLoading(false);
    }
  }


  const handleEditAvatar = (type_image: number) => {
    return Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      .then(() => {
        var lastDate = new Date('2018-01-01')
        return MediaLibrary.getAssetsAsync({ first: 500, mediaType: "photo", createdAfter: lastDate.getTime(), sortBy: 'creationTime' });
      })
      .then((result) => {
        setTypeImage(type_image)
        setGalleryImage(result.assets);
        setShowGalleryImage(true);
        setLstImageSelected([])
      });
  }

  const changeValueInput = (name: string, value: string) => {
    setUserInfo({ ...userInfo, [name]: value })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" color="#000" size={20} />
        </TouchableOpacity>
        <Text style={styles.navigationTitle}>Ch???nh s???a trang c?? nh??n</Text>
      </View>
      <ScrollView bounces={false} style={styles.detailsWrapper}>
        <View style={{ ...styles.detail, paddingTop: 0 }}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>???nh ?????i di???n</Text>
            <TouchableOpacity onPress={() => handleEditAvatar(0)}>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Thay ?????i</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: !!localAvatar ? localAvatar : userInfo.avatar }} style={styles.avatar}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>???nh b??a</Text>
            <TouchableOpacity onPress={() => handleEditAvatar(1)}>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Thay ?????i</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: !!localCoverImage ? localCoverImage : userInfo.cover_image }} style={styles.cover}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Ti???u s???</Text>
          </View>
          <TextInput
            value={userInfo?.description ?? ""}
            placeholderTextColor="#000000"
            onChangeText={newText => changeValueInput("description", newText)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Chi ti???t</Text>
          </View>
          <View style={styles.introListWrapper}>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="user" />
              <Text style={styles.introLineText}>H??? t??n</Text>
              <TextInput
                value={userInfo?.username ?? ""}
                placeholderTextColor="#000000"
                onChangeText={newText => changeValueInput("username", newText)}
                style={styles.textInput}
              />
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="home" />
              <Text style={styles.introLineText}>?????a ch???</Text>
              <TextInput
                value={userInfo?.address ?? ""}
                placeholderTextColor="#000000"
                onChangeText={newText => changeValueInput("address", newText)}
                style={styles.textInput}
              />
            </View>

            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="map-marker-alt" />
              <Text style={styles.introLineText}>Th??nh Ph???</Text>
              <TextInput
                value={userInfo?.city ?? ""}
                placeholderTextColor="#000000"
                onChangeText={newText => changeValueInput("city", newText)}
                style={styles.textInput}
              />
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="globe" />
              <Text style={styles.introLineText}>Qu???c gia</Text>
              <TextInput
                value={userInfo?.country ?? ""}
                placeholderTextColor="#000000"
                onChangeText={newText => changeValueInput("country", newText)}
                style={styles.textInput}
              />
            </View>
          </View>
        </View>
        <View style={{ ...styles.detail, ...styles.lastDetail }}>
          <Pressable style={styles.btnModifyMore} onPress={saveData} disabled={loading}>
            <Text style={{ color: '#318bfb', fontSize: 16, fontWeight: '500' }}>{loading ? <ActivityIndicator /> : "L??u th??ng tin"}</Text>
          </Pressable>
        </View>
      </ScrollView>
      <GalleryImage
        visible={showGalleryImage}
        handleEventShow={onHiddenGallery}
        data={galleryImage}
        numberImage={lstImageSelected.length}
        lstSelected={lstImageSelected}
        callBackEvent={handleSelectedImage}
        screen={"Info"}
        type_image={typeImage}
      />
    </SafeAreaView>

  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  navigationBar: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  btnBack: {
    width: 50,
    alignItems: 'center'
  },
  navigationTitle: {
    fontSize: 18
  },
  detailsWrapper: {
    padding: 15,
    height: SCREEN_HEIGHT - (50 + STATUSBAR_HEIGHT)
  },
  detail: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingVertical: 15
  },
  detailTitleWrapper: {
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  avatar: {
    width: 140,
    height: 140,
    alignSelf: "center",
    borderRadius: 140
  },
  cover: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10
  },
  introTxt: {
    color: '#333',
    alignSelf: 'center',
    marginVertical: 10
  },
  introListWrapper: {
    paddingVertical: 10
  },
  introLine: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center'
  },
  introIcon: {
    width: 30,
  },
  introLineText: {
    fontSize: 16,
    fontWeight: '400'
  },
  introHightLight: {
    fontWeight: 'bold',
    fontSize: 16
  },
  highlightGallery: {
    marginVertical: 10
  },
  lastDetail: {
    marginBottom: 100,
    borderBottomWidth: 0
  },
  btnModifyMore: {
    height: 40,
    width: '100%',
    backgroundColor: '#9dd0eb',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#333',
    alignSelf: 'center',
    marginVertical: 5,
    marginLeft: 15,
    borderColor: 'red'
  },
})
