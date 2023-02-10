import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { BASE_URL, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
// import ExTouchableOpacity from '../../components/ExTouchableOpacity'
import { useEffect, useState, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import GalleryImage from "../../components/UploadPost/GalleryImage"
import { getData, getDataObject, IUser, useStore } from '../../store';

const acessType = ["jpeg", "jpg", "png"];
const MAX_IMAGE_SIZE = 4194000; //(Bytes)

interface IQueryString { token: string, username: string, description: string, address: string, city: string, country: string, link: string }

export default function EditPublicInfo({ route }: any) {
  var userInfo_1 = route.params.user

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(userInfo_1);
  const [galleryImage, setGalleryImage] = useState<MediaLibrary.Asset[]>([])
  const [showGalleryImage, setShowGalleryImage] = useState(false);
  const [lstImageSelected, setLstImageSelected] = useState<number[]>([]);

  const [typeImage, setTypeImage] = useState(0)
  const { state } = useStore();
  const [descrip, setDescrip] = useState<string>("");
  const [nName, setNName] = useState<string>("");
  const [address, setAddres] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  
  const onHiddenGallery = () => {
    setShowGalleryImage(false)
  }

  const setValueForImage = (lstImage: any, type_image: number) => {
    if (lstImage.length > 0) {
      var image = galleryImage[lstImage[0]];

      var user = userInfo;
      if (type_image == 0) {
        user.avatar_url = image.uri;
        // console.log(image.uri)
      } else {
        user.cover_url = image.uri;
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
      alert("Bạn chỉ được upload ảnh có định dạng jpeg, jpg, png.");
      checkValidType = false;
    }
    if ((image.height * image.width * 4) > MAX_IMAGE_SIZE) {
      alert("Bạn chỉ được upload ảnh có kích thước tối đa là 4MB!");
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
    const temp = "firebasestorage";
    var formData = new FormData();
    if (userInfo.cover_url != null && !temp.includes(userInfo.cover_url.toLowerCase())) {
      let temp = userInfo.cover_url.toString();
      var type = temp.split(".");
      var t = type[type.length - 1];

      var rt = {
        "uri": temp,
        "name": "cover_image",
        "type": "image/" + t
      }

      formData.append("cover_image", rt as any);
    }

    if (userInfo.avatar_url != null && !temp.includes(userInfo.avatar_url.toLowerCase())) {
      let temp = userInfo.avatar_url.toString();
      var type = temp.split(".");
      var t = type[type.length - 1];

      var rt = {
        "uri": temp,
        "name": "avatar",
        "type": "image/" + t
      }

      formData.append("avatar", rt as any);
    }

    var requestOptions: RequestInit = {
      method: "POST",
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }),
      body: formData
    };

    if (formData.getAll.length <= 1) {
      delete requestOptions["body"]; 
      requestOptions["headers"] = new Headers({
        'Content-Type': 'application/json',
      })
    }

    var uri = `${BASE_URL}/user/set_user_info?`;
    const modal = {} as IQueryString;
    modal.token = state.accessToken;
    modal.username = nName !== "" ? nName : userInfo.name;
    modal.description = descrip !== "" ? descrip : userInfo.introTxt;
    modal.address = address !== "" ? address : userInfo.live_in;
    modal.city = city !== "" ? city : userInfo.from;
    modal.country = country !== "" ? country : "";
    modal.link = "";
    let queryString = new URLSearchParams({ ...modal }).toString();
    uri = uri + queryString;

    // console.log(uri)
    fetch(uri, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" color="#000" size={20} />
        </TouchableOpacity>
        <Text style={styles.navigationTitle}>Chỉnh sửa trang cá nhân</Text>
      </View>
      <ScrollView bounces={false} style={styles.detailsWrapper}>
        <View style={{ ...styles.detail, paddingTop: 0 }}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Ảnh đại diện</Text>
            <TouchableOpacity onPress={() => handleEditAvatar(0)}>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: userInfo.avatar_url }} style={styles.avatar}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Ảnh bìa</Text>
            <TouchableOpacity onPress={() => handleEditAvatar(1)}>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: userInfo.cover_url }} style={styles.cover}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Tiểu sử</Text>
          </View>
          <TextInput 
                placeholder={userInfo.introTxt}
                placeholderTextColor="#000000"
                onChangeText={newText => setDescrip(newText)}
                style={styles.textInput}
                />
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Chi tiết</Text>
          </View>
          <View style={styles.introListWrapper}>
          <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="user" />
              <Text style={styles.introLineText}>Họ tên</Text>
              <TextInput 
                placeholder={userInfo.name}
                placeholderTextColor="#000000"
                onChangeText={newText => setNName(newText)}
                style={styles.textInput}
                />
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="home" />
              <Text style={styles.introLineText}>Địa chỉ</Text>
              <TextInput 
                placeholder={userInfo.live_in}
                placeholderTextColor="#000000"
                onChangeText={newText => setAddres(newText)}
                style={styles.textInput}
                />
            </View>
            
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="map-marker-alt" />
              <Text style={styles.introLineText}>Thành Phố</Text>
              <TextInput 
                placeholder={userInfo.from}
                placeholderTextColor="#000000"
                onChangeText={newText => setCity(newText)}
                style={styles.textInput}
                />
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="globe" />
              <Text style={styles.introLineText}>Quốc gia</Text>
              <TextInput 
                placeholder={userInfo.country}
                placeholderTextColor="#000000"
                onChangeText={newText => setCountry(newText)}
                style={styles.textInput}
                />
            </View>
          </View>
        </View>
        <View style={{ ...styles.detail, ...styles.lastDetail }}>
          <TouchableOpacity style={styles.btnModifyMore} onPress={saveData}>
            <Text style={{ color: '#318bfb', fontSize: 16, fontWeight: '500' }}>Lưu thông tin</Text>
          </TouchableOpacity>
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
    </View>

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
