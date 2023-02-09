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

function ViewPost({ visible, handleEventShow, data, index }: any) {
  const [modalVisible, setModalVisible] = useState(visible);

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(false);
  };

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <SafeAreaView style={styles.container}>
      <Modal 
          animationType="none" 
          transparent={true} 
          visible={modalVisible}
          onRequestClose={hiddenModal}
        >
            <View style={styles.blackContent}>
                <ImageViewer 
                    imageUrls={data} 
                    enableSwipeDown={true}
                    onSwipeDown={hiddenModal}
                    index={index}
                />
            </View>
        </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContent: {
    width: "100%",
    minHeight: 300,
  },
  image: {
    flex: 1,
  },
  blackBackground: {
    flex: 1,
    backgroundColor: "#000",
    outline: "none",
    position: "relative",
  },
  blackContent: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
});

export default ViewPost;
