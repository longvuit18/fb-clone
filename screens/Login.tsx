import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TextInput, ScrollView, Button, StatusBar, TouchableOpacity, TouchableHighlight, ActivityIndicator, Pressable } from "react-native";
import axios from "axios";
import { useStore } from "../store";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {state, dispatch} = useStore();


  const handleLogin = async () => {
    try {
      setInvalid(false);
      setLoading(true);
      const res = await axios.post(`/auth/login?phonenumber=${phoneNumber}&password=${password}`)
      dispatch({type: "LOGIN", payload: res.data?.data})
      setLoading(false);
    } catch (error) {
      console.log(error)
      setInvalid(true);
      setLoading(false);
    }


  };

  return (
    <ScrollView>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#30477C"
        translucent={true}
      />
      <View style={styles.container}>
        <View style={styles.banner}>
          <Image
            style={(false) ? styles.WithoutBanner : styles.bannerImg}
            source={(false) ? require("../assets/facebookLogo.png") : require("../assets/banner.png")}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.lang}>
            <TouchableOpacity>
              {/* <Text onPress={this.englishLang}>
                {this.state.lang} •
              </Text> */}
            </TouchableOpacity>
            <Text>Ngôn ngữ • </Text>
            <TouchableHighlight>
              <TouchableHighlight
              // onPress={() => {
              //   this.setModalVisible(true);
              // }}
              >
                <Text>Việt Nam</Text>
              </TouchableHighlight>
            </TouchableHighlight>
          </View>
          <View style={styles.textInput}>
            <TextInput
              style={styles.formInput}
              placeholder={"Nhập số diện thoại"}
              onChangeText={inputEmail =>
                setPhoneNumber(inputEmail)
              }
            />
            <TextInput
              style={styles.formInput}
              placeholder={"Nhập mật khẩu"}
              secureTextEntry={true}
              onChangeText={inputPassword =>
                setPassword(inputPassword)
              }
            />
          </View>
          {invalid && <View>
            <Text style={styles.validate}>Thông tin đăng nhập không đúng</Text>

          </View>}
          <Pressable style={styles.loginButton} disabled={loading}
              onPress={() => handleLogin()}>
            <Text style={{color: "#fff"}}>{loading ? <ActivityIndicator /> :"Đăng nhập"}</Text>
          </Pressable>
          <Text style={styles.textForgot}>
            {"Quên mât khẩu"}
          </Text>
        </View>
        <View style={styles.orTextContainer}>
          <View style={styles.orTextLine} />
          <Text style={styles.orText}>{"hoặc"}</Text>
          <View style={styles.orTextLine} />
        </View>
        <View style={styles.signOutButton}>
          <Button
            // style={styles.buttonSignOut}
            title={"Tạo account"}
            color="#07A007"
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  validate: {
    color: "red"
  },
  container: {
    flex: 1
  },
  banner: {
    flex: 1.7
  },
  content: {
    flex: 3,
    marginHorizontal: 20
  },
  bannerImg: {
    height: 184,
    width: "100%"
  },
  WithoutBanner: {
    height: 72,
    width: 73,
    marginLeft: 120,
    marginTop: 40,
    marginBottom: 10
  },
  lang: {
    paddingTop: 10,
    color: "#707276",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  textInput: {
    marginTop: 20
  },
  formInput: {
    height: 40,
    borderBottomColor: "#ECEAEC",
    borderBottomWidth: 1,
    marginBottom: 10
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#0084FF",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    height: 40
  },
  textForgot: {
    marginTop: 20,
    textAlign: "center"
  },
  signOutButton: {
    marginTop: 25,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  orTextContainer: {
    flexDirection: "row",
    marginTop: 20
  },
  orTextLine: {
    width: "45%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  orText: {
    width: "10%",
    paddingLeft: 2,
    marginBottom: -6
  }
});