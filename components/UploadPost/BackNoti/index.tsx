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

function BackNoti({ visible, handleEventShow, navigation, callBackSave }: any) {
  const [modalVisible, setModalVisible] = useState(visible);

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(false);
  }

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        >
        <View style={styles.centeredView}></View>
        <View style={{backgroundColor: "#fff"}}>
            <Text style={{marginLeft: 18, marginTop: 10}}>Bạn muốn hoàn thành bài viết của mình sau?</Text>
            <Text style={{fontSize: 10, marginLeft: 18, marginBottom: 18}}>Lưu làm bản nháp hoặc bạn có thể tiếp tục chỉnh sửa</Text>
        </View>
        <View style={styles.modalView}>
            
          <TouchableOpacity style={styles.itemOption} onPress={callBackSave}>
            <Icon name="bookmark" color="#000" style={{fontSize: 20}}></Icon>
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text>Lưu làm bản nháp</Text>
              <Text style={{fontSize: 10}}>Bạn sẽ nhận được thông báo về bản nháp</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemOption} onPress={() => {navigation.goBack()}}>
            <Icon name="trash" color="#000" style={{fontSize: 20}}></Icon>
            <Text style={{marginLeft: 10}}>Bỏ bài viết</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemOption} onPress={hiddenModal}>
            <Icon name="check" color="#548ae1" style={{fontSize: 20}}></Icon>
            <Text style={{marginLeft: 7, color: "#548ae1"}}>Tiếp tục chỉnh sửa</Text>
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

export default BackNoti;
