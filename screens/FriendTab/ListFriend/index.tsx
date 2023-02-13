import React, { useState, useEffect } from "react";
import { 
  Pressable, 
  SafeAreaView,
  StyleSheet, 
  Text, 
  View, 
  Image, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  RefreshControl,
  ActivityIndicator, 
  Alert,
  BackHandler
} from 'react-native';
import { getData, getDataObject, IUser, useStore, storeDataObject, removeDataStore } from '../../../store';
import axios from "axios";
import LottieView from 'lottie-react-native';
import FriendOption from "../FriendOption";

export default function ListFriend(props) {
  const [total, setTotal] = useState<any>(0);
  const [lstRequested, setListRequested] = useState<object[]>([])
  const [curIndex, setCurIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [listFriend, setListFriend] = useState<any[]>([]);
  const { state, dispatch } = useStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [visibleOption, setVisibleOption] = useState(false);
  const [dataOption, setDataOption] = useState<any>();

    const renderItemRequested = ({item, index} : any) => {
        return (
            <View style={{flexDirection: "row", marginVertical: 8, flex: 1, alignItems: "center"}}>
                <TouchableOpacity onPress={()=>{handleGoToUser(item.id)}}>
                  <Image
                      source={{uri: item.avatar}}
                      style={{ width: 45, height: 45, borderRadius: 50, marginRight: 10 }}
                      resizeMode={"cover"}
                  />
                </TouchableOpacity>
                
                <Text>{item.username}</Text>
                <View style={{flex: 1}}></View>
                <TouchableOpacity style={{height: 20, width: 20}} onPress={()=>{showOpition(item);}}>
                  <Text>...</Text>
                </TouchableOpacity>
            </View>

        )
    }

    useEffect(() => {
        getRequestData(0, false);

    }, [])

    const getRequestData = async (index: number, isReload) => {
        setLoader(true);
        var url = `/friend/get_user_friends?user_id=${state.user.id}&index=${index}&count=10`;
        await axios.post(url)
            .then(res => {
            var data = res.data.data;
            const uniqueArray = data.friends.filter((value, index) => {
              const _value = JSON.stringify(value);
              return index === data.friends.findIndex(obj => {
                return JSON.stringify(obj) === _value;
              });
            });
            setListFriend([...uniqueArray]);
            setTotal(data.total)
            getUserInfor(uniqueArray, isReload);
            setIsLoading(false);
            setRefreshing(false);
        })
        .catch(err=>{
            console.log(err);
            setIsLoading(false);
            setLoader(false);
            setRefreshing(false);
            //alert("Có lỗi xảy ra! Vui lòng thử lại");
        })
    }

    const handleBack = () => {
      props.route.params.onGoBack();
      props.navigation.goBack()
    }

    useEffect(() => {
      const backAction = () => {
        handleBack();
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
  
      return () => backHandler.remove();
    }, []);

    const getUserInfor = async (listFriend: any, isReload: any) => {
      var data = [];
      for(var i=0; i<listFriend.length; i++){
        var item = listFriend[i];
        var id = item.id;
        const res = await axios.post(`/user/get_user_info?user_id=${id}`)
        const mapUser = res.data.data
        const mapData = {
            avatar: mapUser?.avatar ?? 'https://i.ibb.co/GsY7vbz/contacts-64.png',
            username: mapUser?.username ?? "Unknow",
            created: item.created,
            id: id,
        }
        data.push(mapData);
      }

      if(isReload){
        setListRequested([...data]);
      }
      else{
        setListRequested([...lstRequested, ...data]);
      }
      setLoader(false);
    }

    const handleGoToUser = (userId: string) => {
      props.navigation.navigate('Profile', { screen: 'ProfileTab', params: { authorId: userId } })
    }

    const handleScrollEndList = async () => {
      if(lstRequested.length >= 10){
        setIsLoading(true);
        var index = curIndex + 10;
        await getRequestData(index, false);
        setCurIndex(index);
      }
    }

    const handlePullDown = () => {
      setRefreshing(true);
      setCurIndex(0);
      setListRequested([...[]])
      getRequestData(0, true);
    }

    const onHideOption = () => {
      setVisibleOption(false);
    }

    const showOpition = (item: any) => {
      setDataOption(item);
      setVisibleOption(true);
    }

    const handleCallBackOption = (item : any) => {
      Alert.alert("Cảnh báo", `Bạn có thực sự muốn chặn ${item.username}?`, [
        {
          text: 'Bỏ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Chặn', onPress: () => handleBlock(item)},
      ])
    }

    const handleBlock = async (item: any) => {
      var id = item.id;
      setLoader(true);
      var url = `/friend/set_block?user_id=${id}&type=0`;
      await axios.post(url)
      .then(() => {
          setLoader(false);
          handlePullDown();
      })
      .catch((err) => {
          setLoader(false);
          Alert.alert('', `Bạn đã chặn ${item.username}`, [
              {
                text: 'Đóng',
                style: 'cancel'
              },
            ]);
      })
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity style={{marginHorizontal: 10}} onPress={()=>{handleBack()}}>
                    <ImageBackground
                        source={require("../../../assets/icon/arrow-11-64.png")}
                        style={{ width: 20, height: 20 }}
                    />
                </TouchableOpacity>
                <Text>Tất cả bạn bè</Text>
                <View style={{flex: 1}}></View>
                <Image
                    source={require("../../../assets/icon/search-3-32.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode={"cover"}
                />
            </View>
        </View>
        <View style={{paddingHorizontal: 10}}>
          <View style={{marginBottom: 15}}>
            <Text style={{fontSize: 20, fontWeight: "700"}}>{total} bạn bè</Text>
          </View>
          <FlatList
              style={styles.listItem}
              data={lstRequested}
              numColumns={1}
              renderItem={renderItemRequested}
              keyExtractor={(item : any, index: number) => index.toString()}
              onEndReached={handleScrollEndList}
              onEndReachedThreshold={16}
              refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handlePullDown}
                />
              }
            />
        </View>
        {isLoading && <ActivityIndicator size="large" color='#babec5' />}
        {loader && <LottieView source={require('../../../assets/icon/loader.json')} autoPlay loop />}
        <FriendOption 
          visible={visibleOption} 
          data={dataOption}
          handleEventShow={onHideOption}
          callBackEvent={handleCallBackOption}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: StatusBar.currentHeight,
    padding: 10
  },
  buttonActive: {
    backgroundColor: "#528eef",
    width: 120,
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 5
  },
  button: {
    backgroundColor: "#babec5",
    width: 120,
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 5
  },
  header: {
    display: "flex",
    borderBottomWidth: 1,
    borderBottomColor: "#babec5",
    paddingBottom: 15,
    marginBottom: 15
  },

  listItem:{
    marginBottom: 50
  },
  btnAction: {
    backgroundColor: "#babec5",
    alignSelf: 'flex-start',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 5
  },
  avatar:{
    width: 50,
    height: 50
  },
});
