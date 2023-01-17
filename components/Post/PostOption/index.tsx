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

function PostOption({ visible, handleEventShow, canEdit, callBackEvent }: any) {
  const [modalVisible, setModalVisible] = useState(visible);

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(false);
  }

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const deletePost = () => {
    callBackEvent(0);
    hiddenModal();
  }

  const editPost = () => {
    callBackEvent(1);
    hiddenModal();
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
          <TouchableOpacity style={styles.itemOption}>
            <Icon name="bell" color="#000" style={{fontSize: 20}}></Icon>
            <Text style={{marginLeft: 5}}>Tắt thông báo bài viết này</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemOption}>
            <Icon name="bookmark" color="#000" style={{fontSize: 20}}></Icon>
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text>Lưu bài viết</Text>
              <Text style={{fontSize: 10}}>Thêm vào danh sách các mục đã lưu</Text>
            </View>
          </TouchableOpacity>
          {canEdit && (
            <TouchableOpacity style={styles.itemOption} onPress={deletePost}>
              <Icon name="trash" color="#000" style={{fontSize: 20}}></Icon>
              <Text style={{marginLeft: 10}}>Xoá</Text>
            </TouchableOpacity>
          )}
          {canEdit && (
            <TouchableOpacity style={styles.itemOption} onPress={editPost}>
              <Icon name="pen" color="#000" style={{fontSize: 20}}></Icon>
              <Text style={{marginLeft: 7}}>Chỉnh sửa bài viết</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.itemOption}>
            <Icon name="link" color="#000" style={{fontSize: 20}}></Icon>
            <Text style={{marginLeft: 7}}>Sao chép liên kết</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemOption}>
            <Icon name="square" color="#000" style={{fontSize: 20}}></Icon>
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text>Tìm hỗ trợ hoặc báo cáo bài viết</Text>
              <Text style={{fontSize: 10}}>Tôi lo ngại về bài viết này</Text>
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

export default PostOption;
