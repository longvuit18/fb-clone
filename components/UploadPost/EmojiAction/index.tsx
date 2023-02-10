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
  ScrollView,
  StatusBar,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import GestureRecognizer from 'react-native-swipe-gestures';

const lstEmoji = [
    [
        {
            value: "hạnh phúc",
            icon: require("../../../assets/icon/happy.png")
        },
        {
            value: "có phúc",
            icon: require("../../../assets/icon/blessed.png")
        },
    ],
    [
        {
            value: "đang yêu",
            icon: require("../../../assets/icon/love.png")
        },
        {
            value: "buồn",
            icon: require("../../../assets/icon/sad.png")
        },
    ],
    [
        {
            value: "thật phong cách",
            icon: require("../../../assets/icon/style.png")
        },
        {
            value: "biết ơn",
            icon: require("../../../assets/icon/gratefull.png")
        },
    ]
];

const lstActivities = [
    [
        {
            value: "Đang xem",
            icon: require("../../../assets/icon/glasses-2-32.png")
        },
        {
            value: "Đang ăn",
            icon: require("../../../assets/icon/cake-32.png")
        },
    ],
    [
        {
            value: "Đang tham gia",
            icon: require("../../../assets/icon/calendar-32.png")
        },
        {
            value: "Đang đi",
            icon: require("../../../assets/icon/airplane-3-32.png")
        },
    ],
]

function EmojiAction({ visible, handleEventShow, handleChooseEmoji, emoji }: any) {
  const [modalVisible, setModalVisible] = useState(visible);
  const [showSearch, setShowSearch] = useState(true);
  const [tabActive, setTabActive] = useState(0);

  const [curEmoji, setCurEmoji] = useState<{
    value: string;
    icon: any;
} | null>({
    value: "hạnh phúc",
    icon: require("../../../assets/icon/happy.png")
  })

  const hiddenModal = () => {
    setModalVisible(false);
    handleEventShow(false);
  }

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    if(emoji != undefined && emoji != ""){
        for(var i=0; i<lstEmoji.length; i++){
            if(lstEmoji[i][0].value == emoji){
                setCurEmoji(lstEmoji[i][0]);
                break;
            }
            if(lstEmoji[i][1].value == emoji){
                setCurEmoji(lstEmoji[i][1]);
                break;
            }
        }
        setShowSearch(false);
    }
    else{
        setShowSearch(true);
    }
  }, [emoji]);

  const handleDeleteCurEmoji = () => {
    setCurEmoji(null);
    setShowSearch(true);
    handleChooseEmoji("");
  }

  const handleChooseStatus = (indexX: number, indexY: number) => {
    var status = lstEmoji[indexX][indexY].value
    handleChooseEmoji(status);
    hiddenModal();
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
                                style={{ width: 15, height: 15 }}
                                resizeMode={"cover"}
                            />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 15, fontSize: 16 }}>Bạn cảm thấy thế nào?</Text>
                    </View>
                    <View style={styles.tab}>
                        <TouchableOpacity 
                            onPress={() => {setTabActive(0)}}
                            style={[styles.tabOption, tabActive == 0 ? styles.tabOptionActive : {}]}>
                            <Text style={[{fontWeight: "600"}, tabActive == 0 ? styles.textActive : {}]}>CẢM XÚC</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {setTabActive(1)}}
                            style={[styles.tabOption, tabActive == 1 ? styles.tabOptionActive : {}]}>
                            <Text style={[{fontWeight: "600"}, tabActive == 1 ? styles.textActive : {}]}>HOẠT ĐỘNG</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.action}>
                        {showSearch && 
                            <View style={styles.search}>
                                <Image
                                    source={require("../../../assets/icon/search-3-32.png")}
                                    style={{ width: 20, height: 20 }}
                                    resizeMode={"cover"}
                                />
                                <TextInput 
                                    placeholder="Tìm kiếm"
                                    placeholderTextColor="#babec5"
                                    // underlineColor="transparent"
                                    style={styles.textInput}
                                />
                            </View>
                        }
                        {!showSearch &&
                            <View style={styles.search}>
                                <Image
                                    source={curEmoji?.icon}
                                    style={{ width: 20, height: 20 }}
                                    resizeMode={"cover"}
                                />
                                <Text style={{marginLeft: 10}}>{curEmoji?.value}</Text>
                                <View style={{flex: 1}}></View>
                                <TouchableOpacity onPress={handleDeleteCurEmoji}>
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    {tabActive == 0 &&
                        <ScrollView style={styles.emoji}>
                            {lstEmoji.map((emoji, index) => (
                                <View key={index} style={styles.emojiList}>
                                    <TouchableOpacity style={[styles.emojiItem, 
                                        index == 0 ? {borderTopWidth: 1, 
                                                    borderTopColor: "#babec5",
                                                    } : {},
                                        {borderLeftWidth: 1, borderLeftColor: "#babec5"}]}
                                        onPress={()=>{handleChooseStatus(index, 0)}}
                                    >
                                        <Image
                                            source={emoji[0].icon}
                                            style={{ width: 30, height: 30 }}
                                            resizeMode={"cover"}
                                        />
                                        <Text style={{marginLeft: 10}}>{emoji[0].value}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.emojiItem, 
                                        index == 0 ? {borderTopWidth: 1, borderTopColor: "#babec5"} : {}]}
                                        onPress={()=>{handleChooseStatus(index, 1)}}
                                    >
                                        <Image
                                            source={emoji[1].icon}
                                            style={{ width: 30, height: 30 }}
                                            resizeMode={"cover"}
                                        />
                                        <Text style={{marginLeft: 10}}>{emoji[1].value}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    }
                    {tabActive == 1 &&
                        <ScrollView style={styles.emoji}>
                            {lstActivities.map((emoji, index) => (
                                <View key={index} style={styles.emojiList}>
                                    <TouchableOpacity style={[styles.emojiItem, 
                                        index == 0 ? {borderTopWidth: 1, 
                                                    borderTopColor: "#babec5",
                                                    } : {},
                                        {borderLeftWidth: 1, borderLeftColor: "#babec5"}]}
                                    >
                                        <Image
                                            source={emoji[0].icon}
                                            style={{ width: 30, height: 30 }}
                                            resizeMode={"cover"}
                                        />
                                        <Text style={{marginLeft: 10}}>{emoji[0].value}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.emojiItem, 
                                        index == 0 ? {borderTopWidth: 1, borderTopColor: "#babec5"} : {}]}
                                    >
                                        <Image
                                            source={emoji[1].icon}
                                            style={{ width: 30, height: 30 }}
                                            resizeMode={"cover"}
                                        />
                                        <Text style={{marginLeft: 10}}>{emoji[1].value}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    }
                </View>
                    
            </Modal>
        </GestureRecognizer>
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#fff',
    outline: 'none'
  },
  header: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#babec5",
  },
  tab: {
    height: 45,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  tabOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#babec5",
  },
  tabOptionActive: {
    borderBottomColor: "#2b7ae2",
    borderBottomWidth: 2,
  },
  textActive: {
    color: "#2b7ae2",
  },
  action: {
    width: "100%",
    height: 50,
  },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  textInput: {
    height: 35,
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: "#fff",
    outline: "none",
  },
  emoji: {
    flex: 1,
    paddingHorizontal: 10,
  },
  emojiList: {
    flexDirection: "row",
    height: 50,
    width: "100%",
  },
  emojiItem: {
    flexDirection: "row",
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#babec5",
  }
});

export default EmojiAction;
