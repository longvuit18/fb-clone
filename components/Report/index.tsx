import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Button,
  Alert,
  StatusBar,
  ScrollView,
  FlatList,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from "axios";
import LottieView from 'lottie-react-native';

function Report(props: any) {
    const { navigation, route } = props;
    const [state, setState] = useState<number>(0);
    const [isChoose, setIsChoose] = useState<boolean>(false);
    const [subjectSelected, setSubjectSelected] = useState<string>("");
    const [detailSelected, setDetailSelected] = useState<string>("");
    
    const subject = ["Ảnh khỏa thân", "Bạo lực", "Quấy rồi", "Tự tử/Tự gây thương tích", "Tin giả", "Spam", "Bán hàng trái phép", "Ngôn từ gây thù ghét", "Khủng bố"];
    const [listSubject, setListSubject] = useState<string[]>([...subject]);
    const detail = {
        'Ảnh khỏa thân': ['Ảnh khỏa thân người lớn', 'Gợi dục', 'Hoạt động tình dục', 'Bóc lột tình dục', 'Dịch vụ tình dục', 'Liên quan đến trẻ em', 'Chia sẻ hình ảnh riêng tư'],
        'Bạo lực': ['Hình ảnh bạo lực', 'Tử vong hoặc bị thương nặng', 'Mối đe dọa bạo lực', 'Ngược đãi động vật', 'Vấn đề khác'],
        'Quấy rồi': ['Tôi', 'Một người bạn'],
        'Tự tử/Tự gây thương tích': ['Tự tử/Tự gây thương tích'],
        'Tin giả': ['Tin giả'],
        'Spam': ['Spam'],
        'Bán hàng trái phép': ['Chất cấm, chất gây nghiện', 'Vũ khí', 'Động vật có nguy cơ bị tuyệt chủng', 'Động vật khác', 'Vấn đề khác'],
        'Ngôn từ gây thù ghét': ['Chủng tộc hoặc sắc tộc', 'Nguồn gốc quốc gia', 'Thành phần tôn giáo', 'Phân chia giai cấp xã hội', 'Thiên hướng tình dục', 'Giới tính hoặc bản dạng giới', 'Tình trạng khuyết tật hoặc bệnh tật', 'Hạng mục khác'],
        'Khủng bố': ['Khủng bố'],
    }
    const [listDetail, setListDeatail] = useState<string[]>([]);
    const [searchKey, setSearchKey] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);

    const handleChooseSubject = (item : string) => {
        setSubjectSelected(item);
        var lstDetail = detail[item as keyof object];
        setListDeatail([...lstDetail]);
        setDetailSelected("");
        setSearchKey("");
        setIsChoose(false);
        setState(2);
    }

    const handleChooseDetail = (item : string) => {
        setDetailSelected(item);
        setSearchKey("");
        setIsChoose(true);
        setState(0);
    }
    
    const handleBack = () => {
        setSubjectSelected("");
        setDetailSelected("");
        setSearchKey("");
        setIsChoose(false);
        setListSubject([...subject])
        setListDeatail([]);
        if(state == 0){
            setState(1);
        }
        else{
            setState(0);
        }
    }

    const chooseAnthorSubject = () => {
        setSubjectSelected("");
        setDetailSelected("");
        setSearchKey("");
        setIsChoose(false);
        setListSubject([...subject])
        setListDeatail([]);
        setState(1);
    }

    const handleSearchData = (key : string) => {
        if(state == 1){
            var dataSubject = subject.filter((e, i)=>{
                return e.includes(key);
            })
            setListSubject([...dataSubject])
        }
        else if(state == 2){
            var dataDetail = (detail[subjectSelected as keyof object] as any).filter((e: any, i: number)=>{
                return e.includes(key);
            })
            setListDeatail([...dataDetail])
        }
        setSearchKey(key);
    }

    const sendReport = async () => {
        setLoader(true);
        var url = `/post/report_post?id=${route.params.id}&subject=${subjectSelected}&details=${detailSelected}`;
        await axios.post(url)
        .then(() => {
            setLoader(false);
            Alert.alert('', 'Gửi báo cáo thành công!', [
                {
                  text: 'Đóng',
                  style: 'cancel',
                  onPress: () => navigation.goBack()
                },
              ]);
            
        })
        .catch((err) => {
            setLoader(false);
            alert("Có lỗi xảy ra. Vui lòng thử lại!")
        })
    }

    const handleBlock = async () =>{
        setLoader(true);
        var url = `/friend/set_block?user_id=${route.params.userID}&type=0`;
        await axios.post(url)
        .then(() => {
            setLoader(false);
        })
        .catch((err) => {
            setLoader(false);
            Alert.alert('', `Bạn đã chặn ${route.params.name}`, [
                {
                  text: 'Đóng',
                  style: 'cancel'
                },
              ]);
        })
    }

    const renderItemSubject = ({item, index} : any) => {
        return (
          <TouchableOpacity 
            style={{flexDirection: "row", paddingHorizontal: 20, paddingVertical: 15}}
            onPress={()=>{handleChooseSubject(item)}}
        >
            <Text>{item}</Text>
            <View style={{flex: 1}}></View>
            <ImageBackground
            source={require("../../assets/icon/arrow-24-32.png")}
            style={{ width: 15, height: 15 }}
            />
          </TouchableOpacity>
    
        )
    }

    const renderItemDetail = ({item, index} : any) => {
    return (
        <TouchableOpacity 
            style={{flexDirection: "row", paddingHorizontal: 20, paddingVertical: 15}}
            onPress={()=>{handleChooseDetail(item)}}
        >
            <Text>{item}</Text>
            <View style={{flex: 1}}></View>
        </TouchableOpacity>

    )
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
            <View style={styles.header}>
                {(isChoose || state != 0) && (
                    <TouchableOpacity style={{marginLeft: 10}} onPress={()=>{handleBack()}}>
                        <ImageBackground
                        source={require("../../assets/icon/arrow-11-64.png")}
                        style={{ width: 20, height: 20 }}
                        />
                    </TouchableOpacity>
                )}
                {state != 0 && 
                    (
                        <TextInput
                            multiline={false}
                            editable
                            placeholder="Tìm kiếm"
                            placeholderTextColor="grey"
                            value={searchKey}
                            style={[styles.textInput]}
                            onChangeText={(text : any)=>{handleSearchData(text)}}
                        />
                    )
                }
                <View style={{flex: 1}}></View>
                <TouchableOpacity style={{marginRight: 10}} onPress={()=>{navigation.goBack()}}>
                    <ImageBackground
                    source={require("../../assets/icon/x-mark-32.png")}
                    style={{ width: 15, height: 15 }}
                    />
                </TouchableOpacity>
            </View>
            {state == 0 ? 
                (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {
                            !isChoose ? 
                            (
                                <View style={{padding: 15}}>
                                    <Text style={[styles.fontBold, {fontSize: 18}]}>Vui lòng chọn vấn đề để tiếp tục</Text>
                                    <Text style={{opacity: 0.7}}>Bạn có thể báo cáo bài viết sau khi chọn vấn đề.</Text>
                                    <View style={styles.subjectContainer}>
                                        {
                                            subject.map((e, index)=>(
                                                <TouchableOpacity key={index} style={styles.subjectReport}
                                                    onPress={() => {handleChooseSubject(e.toString())}}
                                                >
                                                    <Text style={styles.fontBold}>{e}</Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                        <TouchableOpacity style={[styles.subjectReport, {flexDirection: "row"}]} onPress={()=>{chooseAnthorSubject()}}>
                                            <Icon
                                                name="search"
                                                color="#000"
                                                // backgroundColor="white"
                                                style={{ fontSize: 15, textAlign: 'center', marginRight: 5 }}></Icon>
                                            <Text style={styles.fontBold}>Vấn đề khác</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                            :
                            (
                                <View style={{padding: 15, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#babec5"}}>
                                    <ImageBackground
                                        source={require("../../assets/icon/warning.png")}
                                        style={{ width: 30, height: 30, marginBottom: 10 }}
                                    />
                                    <Text style={{color: "#000", fontWeight: "700", marginBottom: 10}}>Bạn đã chọn</Text>
                                    <View style={[styles.subjectReportActive, {flexDirection: "row"}]}>
                                        <ImageBackground
                                            source={require("../../assets/icon/check.png")}
                                            style={{ width: 15, height: 15, marginRight: 5 }}
                                        />
                                        <Text style={[styles.fontBold, {color: "#fff"}]}>{subjectSelected}</Text>
                                    </View>
                                    <View style={[styles.subjectReportActive, {flexDirection: "row"}]}>
                                        <ImageBackground
                                            source={require("../../assets/icon/check.png")}
                                            style={{ width: 15, height: 15, marginRight: 5 }}
                                        />
                                        <Text style={[styles.fontBold, {color: "#fff"}]}>{detailSelected}</Text>
                                    </View>
                                    <Text style={{width: "90%"}}>Bạn có thể báo cáo nếu cho rằng nội dung này vi phạm 
                                        <Text style={styles.fontBold}> Tiêu chuẩn cộng đồng </Text> 
                                        của chúng tôi. Xin lưu ý rằng đội ngữ xét duyệt của chúng tôi hiện có ít nhân lực hơn.</Text>
                                </View>
                            )
                        }
                        
                        <View style={{padding: 15}}>
                            <Text >Các bước bạn có thể thực hiện</Text>
                            <TouchableOpacity style={styles.itemOption} onPress={()=>{handleBlock()}}>
                                <Icon name="user" color="#000" style={{fontSize: 20}}></Icon>
                                <View style={{flexDirection: 'column', marginLeft: 10}}>
                                    <Text>Chặn {route.params.name}</Text>
                                    <Text style={{opacity: 0.7, fontSize: 12}}>Các bạn sẽ không thể nhìn thấy hoặc liên hệ với nhau</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.itemOption}>
                                <Icon name="square" color="#000" style={{fontSize: 20}}></Icon>
                                <View style={{flexDirection: 'column', marginLeft: 10}}>
                                    <Text>Bỏ theo dõi {route.params.name}</Text>
                                    <Text style={{opacity: 0.7, fontSize: 12}}>Dừng xem bài viết nhưng vẫn là bạn bè</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{padding: 15}}>
                            {!isChoose && 
                            (
                                <View 
                                    style={
                                        {backgroundColor: "#fff", flexDirection: "row",
                                        alignItems: "center", paddingHorizontal: 8, paddingVertical: 15,
                                        borderWidth: 1,
                                        borderColor: "#babec5",
                                        marginBottom: 15
                                        }
                                    }>
                                    <View 
                                        style={
                                            {height: 20, width: 20, borderRadius: 50, backgroundColor: "#babec5",
                                                alignItems: "center"
                                            }
                                        }>
                                        <Text style={{color: "#fff"}}>i</Text>
                                    </View>
                                    <Text style={{width: "90%", marginLeft: 10}}>Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chần chừ mà hãy báo ngay cho dịch vụ cấp cứu tại địa phương</Text>
                                </View>
                            )}
                            
                            {
                                isChoose &&
                                (
                                    <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={()=>{sendReport()}}>
                                        <Text style={[styles.contentBtn, styles.contentBtnActive]}>Gửi báo cáo</Text>
                                    </TouchableOpacity>
                                ) 
                            }
                            
                        </View>
                    </ScrollView>
                )
                :
                state == 1 ? 
                (
                    <FlatList
                    style={styles.listItem}
                    data={listSubject}
                    numColumns={1}
                    renderItem={renderItemSubject}
                    keyExtractor={(item : any, index: number) => index.toString()}
                    />
                ) 
                : 
                (
                    <FlatList
                    style={styles.listItem}
                    data={listDetail}
                    numColumns={1}
                    renderItem={renderItemDetail}
                    keyExtractor={(item : any, index: number) => index.toString()}
                    />
                )
            }
            
        </View>
        {loader && <LottieView source={require('../../assets/icon/loader2.json')} autoPlay loop />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#babec5",
    flexDirection: "row"
  },
  subjectReport: {
    backgroundColor: "#c5c5c5",
    alignSelf: 'flex-start',
    borderRadius: 15,
    marginBottom: 10,
    marginRight: 5,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  subjectReportActive: {
    backgroundColor: "#528eef",
    borderRadius: 15,
    marginBottom: 10,
    marginRight: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  fontBold: {
    fontWeight: "700"
  },
  subjectContainer:{
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#babec5"
  },
  itemOption: {
    width: '100%',
    backgroundColor: '#fff',
    outline: 'none',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn:{
    alignItems: "center",
    flex: 1,
    backgroundColor: "#babec5",
    paddingVertical: 15,
    borderRadius: 10
  },
  contentBtn: {
    fontSize: 18,
    color: "#c5c5c5"
  },
    btnActive: {
        backgroundColor: "#528eef"
    },
    contentBtnActive: {
        color: "#fff",
        fontWeight: "600",
    },
    listItem: {

    },
    textInput: {
        marginLeft: 20,
        backgroundColor: "#babec5",
        borderRadius: 5,
        flex: 10,
        paddingLeft: 10
    }
});

export default Report;
