import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store';

export default function Setting(props) {
  const { dispatch } = useStore();
  return (
    <View style={styles.container}>
      <Pressable style={[styles.button, {backgroundColor: "#528eef"}]} onPress={()=>{props.navigation.navigate('Profile', { screen: 'ProfileTab' })}}>
        <Text style={{color: "#fff"}}>Thông tin của tôi</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => {
        dispatch({ type: "LOG_OUT" })
      }}>
        <Text style={{color: "#fff"}}>Đăng xuất</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#07A007",
    padding: 10,
    marginVertical: 10
  }
});
