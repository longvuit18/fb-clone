import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Button,
  Modal,
  FlatList,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import GestureRecognizer from 'react-native-swipe-gestures';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

const windowWidth = Dimensions.get('window').width;

function GalleryImage({ visible, handleEventShow, data, numberImage, lstSelected, callBackEvent }: any) {
  const [modalVisible, setModalVisible] = useState(visible);
  const [imageSelected, setImageSelected] = useState<number[]>(lstSelected);

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(false);
  };

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    setImageSelected(lstSelected);
  }, [lstSelected]);

  const handleSelectedImage = (selected : boolean, index : number) => {
    console.log(numberImage);
    if(selected){
      var indexList = imageSelected.indexOf(index);
      var tmpArray = imageSelected;
      tmpArray.splice(indexList, 1);
      setImageSelected([...tmpArray])
    }
    else{
      if(imageSelected.length + numberImage >= 4){
        alert("Bạn chỉ được chọn tối đa 4 ảnh!")
      }
      else{
        setImageSelected([...imageSelected, index])
      }
    }
  }

  const handleUploadImage = () => {
    callBackEvent(imageSelected);
    hiddenModal();
  }

  const renderItem = ({item, index} : any) => {
    var selected = false;
    var orderSelected = null;
    if(imageSelected.length > 0 && imageSelected.includes(index)){
      selected = true;
      orderSelected = imageSelected.indexOf(index) + 1;
    }
    return (
      <TouchableOpacity style={{position: "relative"}} onPress={() => {handleSelectedImage(selected, index)}}>
        <Image 
          style={styles.image}
          source={{uri: item.uri}}
        />
        <View 
          style={[
            styles.chooseImage, 
            selected ? styles.chooseImageChecked : null,
            {alignItems: "center", justifyContent: "center"}
          ]}>
          {selected && (
            <Text style={{}}>{orderSelected}</Text>
          )}
          
        </View>
      </TouchableOpacity>

    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <GestureRecognizer
        style={{flex: 1}}
        onSwipeRight={hiddenModal}
      >
        <Modal 
          animationType="none" 
          transparent={true} 
          visible={modalVisible}
          onRequestClose={hiddenModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.header}>
                <TouchableOpacity style={{ marginTop: 2 }} onPress={hiddenModal}>
                  <Image
                    source={require("../../../assets/icon/arrow-121-32.png")}
                    style={{ width: 20, height: 15 }}
                    resizeMode={"cover"}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity style={[styles.btnPost, styles.btnPostActive]} onPress={handleUploadImage}>
                  <Text>Upload</Text>
                </TouchableOpacity>
            </View>
            <FlatList
              style={styles.listImage}
              data={data}
              numColumns={3}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          
        </Modal>
      </GestureRecognizer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#fff",
    outline: "none",
  },
  header: {
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#babec5",
  },
  btnPost: {
    height: 35,
    backgroundColor: "#babec5",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },

  btnPostActive: {
    backgroundColor: "#528eef",
  },
  listImage: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  image: {
    width: windowWidth/3.26,
    height: 200,
    marginRight: 5,
    marginBottom: 5
  },
  chooseImage: {
    width: 20,
    height: 20,
    position: "absolute",
    right: 8,
    top: 5,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: "transparent"
  },
  chooseImageChecked:{
    backgroundColor: "#528eef",
    borderWidth: 0,
  }
});

export default GalleryImage;
