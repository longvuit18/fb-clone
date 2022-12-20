import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";

function Story({source}) {
    return ( 
        <SafeAreaView style={styles.container}>
          <TouchableOpacity style={{flex: 1,}}>
              <Image
                style={styles.avatar}
                source={source.avatar}
              />
              <View style={styles.imageMain}>
                  <Image
                    style={styles.img}
                    source={source.image}
                  />
              </View>
              <Text style={styles.name}>{source.name}</Text>
          </TouchableOpacity>
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    container: {
      width: 100,
      height: 180,
      borderWidth: 0,
      borderRadius: 10,
      overflow: "hidden",
      marginRight: 5,
      flex: 1,
    },
    avatar: {
      height: 30,
      width: 30,
      position: 'absolute',
      zIndex: 5,
      borderRadius: 50,
      left: 5,
      top: 5,
      borderWidth: 2,
      borderColor: 'blue'
    },
    imageMain: {
      flex: 1,
      backgroundColor: '#fff',
    },
    img: {
      flex: 1,
    },
    name: {
      position: 'absolute',
      bottom: 3,
      zIndex: 5,
      color: '#fff',
      marginLeft: 5
    }
});

export default Story;