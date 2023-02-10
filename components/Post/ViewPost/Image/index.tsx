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
  BackHandler,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

function ImagePost({urlImage, callBackEvent}: any) {
  return (
    <View style={styles.imageContent}>
      <TouchableOpacity style={styles.image} onPress={callBackEvent}>
        <Image style={styles.image} source={{ uri: urlImage }} />
      </TouchableOpacity>
      
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginBottom: 5,
        }}
      >
        <Icon
          name="thumbs-up"
          color="#318bfb"
          // backgroundColor="white"
          style={{ marginRight: 5 }}
        ></Icon>
        <Text style={{ color: "#babec5" }}>50</Text>
        <View style={{ display: "flex", flex: 1 }}>
          <Text style={{ color: "#babec5", textAlign: "right" }}>
            100
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 40,
          flexDirection: "row",
          paddingHorizontal: 10,
          borderTopWidth: 1,
          borderColor: "#babec5",
          borderBottomWidth: 1,
          borderBottomColor: "#babec5",
        }}
      >
        <TouchableOpacity style={styles.btnOption}>
          <Icon
            name="thumbs-up"
            color="#318bfb"
            // backgroundColor="white"
            style={styles.iconBtnOption}
          ></Icon>
          <Text style={{ color: "#318bfb" }}>Thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnOption, { marginRight: 15 }]}>
          <Icon
            name="comment-alt"
            color="gray"
            // backgroundColor="white"
            style={styles.iconBtnOption}
          ></Icon>
          <Text style={{ color: "#babec5" }}>Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOption}>
          <Icon
            name="share"
            color="gray"
            // backgroundColor="white"
            style={styles.iconBtnOption}
          ></Icon>
          <Text style={{ color: "#babec5" }}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    btnOption: {
      flex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    iconBtnOption: {
      fontSize: 17,
      marginRight: 5,
    },
    imageContent: {
      width: "100%",
      minHeight: 400,
    },
    image: {
      flex: 1,
    },
  });

export default ImagePost;
