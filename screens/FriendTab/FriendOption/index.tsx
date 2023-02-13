import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

function FriendOption({ visible, handleEventShow, data, callBackEvent }: any) {
  const [modalVisible, setModalVisible] = useState(visible);

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(false);
  }

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const block = () => {
    callBackEvent(data);
    hiddenModal();
  }

  const getTime = () => {
    if(data){
        var date = new Date(Number.parseInt(data.created))
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return `Là bạn bè từ tháng ${month} năm ${year}`;
    }
    else{
        return "";
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hiddenModal}
        >
        <TouchableOpacity style={styles.centeredView} onPress={hiddenModal}></TouchableOpacity>
        <View style={styles.modalView}>
            <View style={{flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10, borderBottomWidth: 1, 
                            borderBottomColor: "#babec5", width: "100%"}}>
                <Image
                    source={{uri: data? data.avatar : ""}}
                    style={{ width: 45, height: 45, borderRadius: 50, marginRight: 10 }}
                    resizeMode={"cover"}
                />
                <View>
                    <Text style={{fontWeight: "700", fontSize: 15}}>{data ? data.username : "" }</Text>
                    <Text>{getTime()}</Text>
                </View>
            </View>
            
          <TouchableOpacity style={styles.itemOption}>
            <Icon name="inbox" color="#000" style={{fontSize: 20}}></Icon>
            <Text style={{marginLeft: 5}}>Nhắn tin cho {data ? data.username : "" }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemOption}>
            <Icon name="bookmark" color="#000" style={{fontSize: 20}}></Icon>
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text>Bỏ theo dõi</Text>
              <Text style={{fontSize: 10}}>Không nhìn thấy bài viết của nhau nữa nhưng vẫn là bạn bè</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemOption} onPress={() => block()}>
              <Icon name="trash" color="#000" style={{fontSize: 20}}></Icon>
              <View style={{flexDirection: 'column', marginLeft: 10}}>
                <Text>Chặn {data ? data.username : "" }</Text>
                <Text style={{fontSize: 10}}>{data ? data.username : "" } sẽ không thể nhìn thấy bạn hoặc liên hệ với bạn trên facebook</Text>
              </View>
            </TouchableOpacity>
          <TouchableOpacity style={styles.itemOption}>
              <Icon name="trash" color="red" style={{fontSize: 20}}></Icon>
              <View style={{flexDirection: 'column', marginLeft: 10}}>
                <Text style={{color: "red"}}>Huỷ kết bạn với {data ? data.username : "" }</Text>
                <Text style={{fontSize: 10}}>Xoá {data ? data.username : "" } khỏi danh sách bạn bè</Text>
              </View>
            </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#babec5',
    opacity: 0.5,
    outline: 'none'
  },
  modalView: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    backgroundColor: 'white',
    flexDirection: 'column',
    height: 'auto'
  },
  itemOption: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    outline: 'none',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FriendOption;
