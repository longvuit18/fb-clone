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
  StatusBar,
  ImageBackground 
} from 'react-native';
import { useStore } from '../../../store';

export default function ListFriend(props) {
  const { dispatch } = useStore();
  const [total, setTotal] = useState<any>(150);
  const [lstRequested, setListRequested] = useState<object[]>([
    {id: "11111", username: "Tesst", avatar: 'https://i.ibb.co/GsY7vbz/contacts-64.png', created: 1676090550306},
    {id: "11111", username: "Tesst", avatar: 'https://i.ibb.co/GsY7vbz/contacts-64.png', created: 1676090550306}
  ])
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
