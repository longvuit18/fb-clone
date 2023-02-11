import React, { useState, useEffect} from "react";
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
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useStore, removeDataStore, storeDataObject, getDataObject } from '../../store';
import axios from "axios";

export default function Friend(props) {
  const [lstRequested, setListRequested] = useState<object[]>([])
  const [curIndex, setCurIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lstAccept, setLstAccept] = useState<number[]>([]);
  const [lstDenie, setLstDenie] = useState<number[]>([])
  const { state, dispatch } = useStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getRequestData(0);

  }, [])

  const handleScrollEndList = async () => {
    if(lstRequested.length >= 10){
      setIsLoading(true);
      var index = curIndex + 10;
      await getRequestData(index);
      setCurIndex(index);
    }
  }

  const getRequestData = async (index: number) => {
    var url = `/friend/get_requested_friends?index=${index}&count=10`;
    await axios.post(url)
    .then(res => {
      var data = res.data.data.request;

      const uniqueArray = data.filter((value, index) => {
        const _value = JSON.stringify(value);
        return index === data.findIndex(obj => {
          return JSON.stringify(obj) === _value;
        });
      });

      setListRequested([...lstRequested, ...uniqueArray]);
      setIsLoading(false);
      setRefreshing(false);
    })
    .catch(err=>{
      console.log(err);
      setIsLoading(false);
      setRefreshing(false);
      //alert("Có lỗi xảy ra! Vui lòng thử lại");
    })
    
  }

  const handlePullDown = () => {
    setRefreshing(true);
    setCurIndex(0);
    setListRequested([])
    getRequestData(0);
  }

  const handleAccept = async (accept: boolean, userId: any, index: number) => {
    var type = 0;
    if(accept){
      type = 1;
      setLstAccept([...lstAccept, index])
    }
    else{
      setLstDenie([...lstDenie, index])
    }

    var url = `/friend/set_accept_friend?user_id=${userId}&is_accept=${type}`;
    await axios.post(url)
    .then(res => {
      var key =  `requestFriend_${userId}_${state.user.id}`;
      removeDataStore(key);
    })
    .catch(err=>{
      console.log(err);
      alert("Có lỗi xảy ra! Vui lòng thử lại");
    })
  }

  const handleGoToUser = (userId: string) => {
    props.navigation.navigate("ProfileTab", {authorId: userId})
  }

  const renderItemRequested = ({item, index} : any) => {
    let createdDate = new Date(Number.parseInt((item.created).toString()));
    let now = new Date();

    var isAcc = (lstAccept.indexOf(index) != -1);
    var isDe = (lstDenie.indexOf(index) != -1);
    return (
      <View style={{flexDirection: "row", marginVertical: 5, flex: 1, alignItems: "center"}}>
        <TouchableOpacity onPress={() => {handleGoToUser(item.id)}}>
          <Image
              source={{uri: item.avatar ? item.avatar : "https://i.ibb.co/GsY7vbz/contacts-64.png"}}
              style={{ width: 50, height: 50, borderRadius: 50 }}
              resizeMode={"cover"}
          />
        </TouchableOpacity>
        
        <View style={{display: "flex", flexDirection: "column", flex: 1, marginLeft: 10}}>
          <View style={{flexDirection: "row", marginBottom: 10}}>
            <Text style={{fontSize: 15}}>{item.username ? item.username : "Unknow"}</Text>
            <View style={{flex: 1}}></View>
            <Text>{getTimeBetweenTwoDate(createdDate, now)}</Text>
          </View>
          {
            isAcc ? 
              (
                <View>
                  <Text>Đã chấp nhận lời mời</Text>
                </View>
              ) 
              : 
              (
                isDe ? 
                  (
                    <View>
                      <Text>Đã từ chối lời mời</Text>
                    </View>
                  )
                  :
                  (
                    <View style={{flexDirection: "row"}}>
                      <TouchableOpacity style={styles.buttonActive} onPress={()=>{handleAccept(true, item.id, index)}}>
                        <Text style={{color: "#fff", fontWeight: "700"}}>Chấp nhận</Text>
                      </TouchableOpacity>
                      <View style={{flex: 1}}></View>
                      <TouchableOpacity style={styles.button} onPress={()=>{handleAccept(false, item.id, index)}}>
                        <Text style={{color: "#000", fontWeight: "700"}}>Xoá</Text>
                      </TouchableOpacity>
                    </View>
                  )
              )
          }
          
        </View>
        
      </View>

    )
}

const getTimeBetweenTwoDate = (firstDate : Date, secondDate: Date) => {
  const seconds = (secondDate.getTime() - firstDate.getTime()) / 1000;
  if(seconds < 60){
    return "Vừa xong";
  }
  else if(seconds < 3600){
    let minutes = Math.ceil(seconds / 60);
    return minutes + " phút";
  }
  else if(seconds < 86400){
    let hours = Math.ceil(seconds / 3600);
    return hours + " giờ";
  }
  else if(seconds < 432000){
    let days = Math.ceil(seconds / 86400);
    return days + " ngày";
  }
  else{
    return firstDate.getDate() + " thg " + (firstDate.getMonth()+1) + ", " + firstDate.getUTCFullYear()
  }
}



  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View style={{flexDirection: "row"}}>
                <Text style={{fontSize: 20, fontWeight: "700"}}>Bạn bè</Text>
                <View style={{flex: 1}}></View>
                <Image
                    source={require("../../assets/icon/search-3-32.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode={"cover"}
                />
            </View>
            <View style={{flexDirection: "row", marginTop: 10}}>
                <TouchableOpacity style={styles.btnAction} onPress={()=>{props.navigation.navigate("SuggestTab")}}>
                    <Text style={{fontWeight: "700", color: "#000"}}>Gợi ý</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAction} onPress={()=>{props.navigation.navigate("ListFriend")}}>
                    <Text style={{fontWeight: "700", color: "#000"}}>Tất cả bạn bè</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View>
          <View>
            <Text style={{fontSize: 20, fontWeight: "700"}}>Lời mời kết bạn</Text>
          </View>
          <FlatList
              style={styles.listItem}
              data={lstRequested}
              numColumns={1}
              renderItem={renderItemRequested}
              keyExtractor={(item : any, index: number) => index.toString()}
              onEndReached={handleScrollEndList}
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
