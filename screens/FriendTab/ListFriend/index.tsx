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
  ImageBackground 
} from 'react-native';
import { getData, getDataObject, IUser, useStore, storeDataObject, removeDataStore } from '../../../store';
import axios from "axios";

export default function ListFriend(props) {
  const [total, setTotal] = useState<any>(0);
  const [lstRequested, setListRequested] = useState<object[]>([])
  const [curIndex, setCurIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state, dispatch } = useStore();

    const renderItemRequested = ({item, index} : any) => {
        return (
            <View style={{flexDirection: "row", marginVertical: 8, flex: 1, alignItems: "center"}}>
                <Image
                    source={{uri: item.avatar}}
                    style={{ width: 45, height: 45, borderRadius: 50, marginRight: 10 }}
                    resizeMode={"cover"}
                />
                <Text>{item.username}</Text>
                
            </View>

        )
    }

    useEffect(() => {
        getRequestData(0);

    }, [])

    const getRequestData = async (index: number) => {
        console.log(state.user.id)
        var url = `/friend/get_user_friends?user_id=${state.user.id}&index=${index}&count=10`;
        await axios.post(url)
        .then(res => {
            console.log(res.data.data)
        var data = res.data.data.list_users;
        setListRequested([...lstRequested, ...data]);
        setIsLoading(false);
        })
        .catch(err=>{
        console.log(err);
        setIsLoading(false);
        alert("Có lỗi xảy ra! Vui lòng thử lại");
        })
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
            />
        </View>
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
