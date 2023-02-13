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
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useStore, removeDataStore, storeDataObject, getDataObject } from '../../../store';
import axios from "axios";

export default function SuggestTab(props) {
  const [curIndex, setCurIndex] = useState<number>(0);
  const [lstRequested, setListRequested] = useState<object[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lstIndexSend, setLstIndexSend] = useState<number[]>([]);
  const { state, dispatch } = useStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getRequestData(0, false);
  }, [])

  const handleScrollEndList = async () => {
    if(lstRequested.length >= 10){
      setIsLoading(true);
      var index = curIndex + 10;
      await getRequestData(index, false);
      setCurIndex(index);
    }
  }

  const getRequestData = async (index: number, isReload: any) => {
    var url = `/friend/get_list_suggested_friends?index=${index}&count=10`;
    await axios.post(url)
    .then(res => {
      var data = res.data.data.list_users;
      data = data.filter((e, index) => {
        return e.user_id != state.user.id;
      })

      const uniqueArray = data.filter((value, index) => {
        const _value = JSON.stringify(value);
        return index === data.findIndex(obj => {
          return JSON.stringify(obj) === _value;
        });
      });
      setListRequested([...[]]);
      if(isReload){
        setListRequested([...uniqueArray]);
      }
      else{
        setListRequested([...lstRequested, ...uniqueArray]);
      }
      setIsLoading(false);
      setRefreshing(false);
    })
    .catch(err=>{
      console.log(err);
      setIsLoading(false);
      setRefreshing(false);
      alert("Có lỗi xảy ra! Vui lòng thử lại");
    })
  }

  const handlePullDown = () => {
    setRefreshing(true);
    setCurIndex(0);
    setListRequested([...[]])
    setLstIndexSend([...[]])
    getRequestData(0, true);
  }

  const handleAddRequest = async (userId : string, index: number) => {
    setLstIndexSend([...lstIndexSend, index]);
    var url = `/friend/set_request_friend?user_id=${userId}`;
    await axios.post(url)
    .then(() => {
        var key =  `requestFriend_${userId}_${state.user.id}`;
        removeDataStore(key);
        storeDataObject(key, {check: true});
    })
    .catch((err) => {
        alert("Có lỗi xảy ra! Vui lòng thử lại")
    })
  }

  const handleGoToUser = (userId: string) => {
    props.navigation.setParams({authorId: userId})
    props.navigation.navigate('Profile', { screen: 'ProfileTab', params: { authorId: userId }})
  }

  const renderItemSuggest = ({item, index} : any) => {
    var isSend = (lstIndexSend.indexOf(index) != -1);
    return (
      <View style={{flexDirection: "row", marginVertical: 8, flex: 1, alignItems: "center"}}>
        <TouchableOpacity onPress={() => {handleGoToUser(item.user_id)}}>
            <Image
                source={{uri: item.avatar ? item.avatar : "https://i.ibb.co/GsY7vbz/contacts-64.png"}}
                style={{ width: 45, height: 45, borderRadius: 50, marginRight: 10 }}
                resizeMode={"cover"}
            />
        </TouchableOpacity>
        
        <View style={{display: "flex", flexDirection: "column", flex: 1, marginLeft: 10}}>
          <View style={{flexDirection: "row", marginBottom: 10}}>
            <Text>{item.username ? item.username : "Unknow"}</Text>
            <View style={{flex: 1}}></View>
          </View>
        {isSend? 
            (
                <View>
                    <Text>Đã gửi yêu cầu</Text>
                    <TouchableOpacity style={[styles.button, {width: 200, marginTop: 10}]} >
                        <Text style={{color: "#fff", fontWeight: "700"}}>Huỷ</Text>
                    </TouchableOpacity>
                </View>
            ) 
            : 
            (
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={styles.buttonActive} onPress={()=>{handleAddRequest(item.user_id, index)}}>
                        <Text style={{color: "#fff", fontWeight: "700"}}>Thêm bạn bè</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{color: "#000", fontWeight: "700"}}>Gỡ</Text>
                    </TouchableOpacity>
                </View>
            )
        }
          
        </View>
      </View>

    )
}

const handleBack = () => {
    props.navigation.goBack()
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
                <Text>Gợi ý</Text>
                <View style={{flex: 1}}></View>
                <Image
                    source={require("../../../assets/icon/search-3-32.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode={"cover"}
                />
            </View>
        </View>
        <View>
          <FlatList
              style={styles.listItem}
              data={lstRequested}
              numColumns={1}
              renderItem={renderItemSuggest}
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
    width: 150,
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
