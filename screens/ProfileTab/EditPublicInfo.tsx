import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
// import ExTouchableOpacity from '../../components/ExTouchableOpacity'
import { useEffect, useState, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import GalleryImage from "../../components/UploadPost/GalleryImage"

const acessType = ["jpeg", "jpg", "png"];
const MAX_IMAGE_SIZE = 4194000; //(Bytes)
interface IQueryString { token: string, described?: string, status?: string }

export default function EditPublicInfo({ route }: any) {
  var userInfo_1 = route.params.user
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(userInfo_1);
  const [galleryImage, setGalleryImage] = useState<MediaLibrary.Asset[]>([])
  const [showGalleryImage, setShowGalleryImage] = useState(false);
  const [lstImageSelected, setLstImageSelected] = useState<number[]>([]);

  const [typeImage, setTypeImage] = useState(0)
  const [avatarUrl, setAvatarUrl] = useState<string>(userInfo.avatar_url)
  const [coverUrl, setCoverUrl] = useState<string>(userInfo.cover_url)

  const onHiddenGallery = () => {
    setShowGalleryImage(false)
  }

  const setValueForImage = (lstImage: any, type_image: number) => {
    if (lstImage.length > 0) {
      var uriImages = [];
      var image = galleryImage[lstImage[0]];

      var user = userInfo;
      if (type_image == 0) {
        user.avatar_url = image.uri;
        setAvatarUrl(image.uri)
      } else {
        user.cover_url = image.uri;
        setCoverUrl(image.uri)
      }

      setUserInfo({ ...user })
    }
  }

  const handleSelectedImage = (lstIndex: [number], type_image: number) => {
    var checkValidType = true;
    var lstIndexd = lstIndex.filter(function (item, pos) {
      return lstIndex.indexOf(item) == pos;
    })
    for (var i = 0; i < lstIndexd.length; i++) {
      var index = lstIndexd[i];
      var image = galleryImage[index];
      var type = image.filename.split(".");
      var t = type[type.length - 1];
      if (!acessType.includes(t.toLocaleLowerCase())) {
        alert("Bạn chỉ được upload ảnh có định dạng jpeg, jpg, png.");
        checkValidType = false;
        break;
      }
      if ((image.height * image.width * 4) > MAX_IMAGE_SIZE) {
        alert("Bạn chỉ được upload ảnh có kích thước tối đa là 4MB!");
        checkValidType = false;
        break;
      }
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
    var formData = new FormData();
    if (avatarUrl !== null) {
      let temp = avatarUrl.toString();
      var type = temp.split(".");
      var t = type[type.length - 1].split("?")[0];

      var rt = {
        "uri": temp,
        "name": "avatar",
        "type": "image/" + t
      }

      formData.append("avatar", rt);
    }


    // if (userInfo.cover_url) {
    //   var cover_image = userInfo.avatar_url as string;

    //   var type = cover_image.split(".");
    //   var t = type[type.length - 1].split("?")[0];

    //   var rt = {
    //     "uri": coverUrl,
    //     "name": "avatar",
    //     "type": "image/" + t
    //   }
    //   formData.append("cover", rt);
    // }


    // var requestOptions: RequestInit = {
    //   method: "POST",
    //   headers: new Headers({
    //     'Accept': 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //   }),
    //   body: formData
    // };

    // if (!avatarUrl && !coverUrl) {
    //   delete requestOptions["body"];
    //   requestOptions["headers"] = new Headers({
    //     'Content-Type': 'application/json',
    //   })
    // }

    // var uri = "http://184.169.213.180:3000/it4788/post/add_post?";
    // const modal = {} as IQueryString;
    // modal.token = token!;
    // modal.described = (described) ? described : '';
    // modal.status = (status) ? status : '';
    // let queryString = new URLSearchParams({ ...modal }).toString();
    // uri = uri + queryString;
    // fetch(uri, requestOptions)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('Success:', data);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
  }


  const handleEditAvatar = (type_image: number) => {
    return Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      .then(() => {
        var lastDate = new Date('2018-01-01')
        return MediaLibrary.getAssetsAsync({ first: 500, mediaType: "photo", createdAfter: lastDate.getTime(), sortBy: 'creationTime' });
      })
      .then((result) => {
        console.log(result)
        setTypeImage(type_image)
        setGalleryImage(result.assets);
        setShowGalleryImage(true)
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" color="#000" size={20} />
        </TouchableOpacity>
        <Text style={styles.navigationTitle}>Edit your profile</Text>
      </View>
      <ScrollView bounces={false} style={styles.detailsWrapper}>
        <View style={{ ...styles.detail, paddingTop: 0 }}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Avatar</Text>
            <TouchableOpacity onPress={() => handleEditAvatar(0)}>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: userInfo.avatar_url }} style={styles.avatar}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Cover</Text>
            <TouchableOpacity onPress={() => handleEditAvatar(1)}>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: userInfo.cover_url }} style={styles.cover}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Introduction</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.introTxt}>{userInfo.introTxt}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Details</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.introListWrapper}>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="home" />
              <Text style={styles.introLineText}>
                Live in <Text style={styles.introHightLight}>{userInfo.live_in}</Text>
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="map-marker-alt" />
              <Text style={styles.introLineText}>
                From <Text style={styles.introHightLight}>{userInfo.from}</Text>
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="heart" />
              <Text style={styles.introLineText}>
                Relationship <Text style={styles.introHightLight}>{userInfo.relationship}</Text>
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="rss" />
              <Text style={styles.introLineText}>
                Followed by <Text style={styles.introHightLight}>{userInfo.follower} </Text>followers
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="ellipsis-h" />
              <TouchableOpacity>
                <Text style={styles.introLineText}>
                  View more introductory information
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Hobbies</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ ...styles.detail }}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>HighLight Photos</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.9} style={styles.highlightGallery}>
          </TouchableOpacity>
        </View>
        <View style={{ ...styles.detail, ...styles.lastDetail }}>
          <TouchableOpacity style={styles.btnModifyMore}>
            {/* <FontAwesome5Icon /> */}
            <Text style={{ color: '#318bfb', fontSize: 16, fontWeight: '500' }}>Modify introduction informations</Text>
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
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    height: 94,
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
    height: 40,
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
    marginBottom: 30,
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
  }
})
