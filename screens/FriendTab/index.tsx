import React, { useState } from "react";
import { 
  Pressable, 
  SafeAreaView,
  StyleSheet, 
  Text, 
  View, 
  Image, 
  FlatList, 
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { useStore } from '../../store';

export default function Friend(props) {
  const { dispatch } = useStore();
  const [lstRequested, setListRequested] = useState<object[]>([
    {id: "11111", username: "Tesst", avatar: 'https://i.ibb.co/GsY7vbz/contacts-64.png', created: 1676090550306},
    {id: "11111", username: "Tesst", avatar: 'https://i.ibb.co/GsY7vbz/contacts-64.png', created: 1676090550306}
  ])
  const renderItemRequested = ({item, index} : any) => {
    let createdDate = new Date(Number.parseInt((item.created).toString()));
    let now = new Date();
    return (
      <View style={{flexDirection: "row", marginVertical: 5, flex: 1, alignItems: "center"}}>
        <Image
            source={{uri: item.avatar}}
            style={{ width: 50, height: 50, borderRadius: 50 }}
            resizeMode={"cover"}
        />
        <View style={{display: "flex", flexDirection: "column", flex: 1, marginLeft: 10}}>
          <View style={{flexDirection: "row", marginBottom: 10}}>
            <Text>{item.username}</Text>
            <View style={{flex: 1}}></View>
            <Text>{getTimeBetweenTwoDate(createdDate, now)}</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <TouchableOpacity style={styles.buttonActive}>
              <Text style={{color: "#fff", fontWeight: "700"}}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={{color: "#000", fontWeight: "700"}}>Xoá</Text>
            </TouchableOpacity>
          </View>
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
