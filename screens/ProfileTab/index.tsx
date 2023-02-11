import React, { useEffect, PureComponent, useState } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { getData, getDataObject, IUser, useStore, storeDataObject, removeDataStore } from '../../store';
import axios from "axios";
import LottieView from 'lottie-react-native';

export default function Profile(props: any) {
    const { navigation, route } = props;
    const [user, setUser] = useState({
        cover_image: undefined,
        avatar: undefined,
        username: "",
        subName: "",
        description: "",
        address: "",
        city: "",
        listing: "",
        country: "",
    })
    const [loader, setLoader] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { state, dispatch } = useStore();
    const authorId = route.params ? (route.params.authorId ? route.params.authorId: null) : null;
    console.log(authorId)
    const isMe = (authorId == state.user.id || authorId == null);
    const [isRequest, setIsRequest] = useState<boolean>(false)

    const [isFriend, setIsFriend] = useState<boolean>(false);
    useEffect(() => {
        getCacheRequest();
        getProfile();
    }, [authorId])

    const getCacheRequest = async () => {
        var key =  `requestFriend_${authorId}_${state.user.id}`;
        var obj = await getDataObject(key)
        if(obj){
            setIsRequest(true);
        }
        else{
            setIsRequest(false);
        }
        
    }

    const handlePullDown = () => {
        setRefreshing(true);
        getProfile();
        
    }

    const getProfile = async () => {
        try {
            var id = state.user.id;
            if(!isMe){
                id = authorId
            }
            const res = await axios.post(`/user/get_user_info?user_id=${id}`)
            const mapUser = res.data.data
            const mapData = ({
                cover_image: mapUser?.cover_image ?? undefined,
                avatar: mapUser?.avatar ?? undefined,
                username: mapUser?.username ?? "",
                subName: "",
                description: mapUser?.description ?? "",
                address: mapUser?.address ?? "",
                city: mapUser?.city ?? "",
                listing: mapUser?.listing ?? "",
                country: mapUser?.country ?? "",
            })

            setUser(mapData);
            var friend = mapUser.is_friend == "true";
            setIsFriend(friend);
            dispatch({ type: "UPDATE_USER_INFO", payload: { userInfo: mapData } })
            setRefreshing(false);
        }
        catch (error) {
            console.log(error)
        }
        
    }

    useEffect(() => {
        if (!!state.userInfo) {
            setUser(state.userInfo);
        }

    }, [state.userInfo])

    const handleBlock = async () => {
        setLoader(true);
        var url = `/friend/set_block?user_id=${authorId}&type=0`;
        await axios.post(url)
        .then(() => {
            setLoader(false);
            navigation.goBack();
        })
        .catch((err) => {
            setLoader(false);
            alert("Có lỗi xảy ra! Vui lòng thử lại")
        })
    }

    const handleSendRequest = async () => {
        setLoader(true);
        var url = `/friend/set_request_friend?user_id=${authorId}`;
        await axios.post(url)
        .then(() => {
            setLoader(false);
            var key =  `requestFriend_${authorId}_${state.user.id}`;
            removeDataStore(key);
            storeDataObject(key, {check: true});
            setIsRequest(true);
        })
        .catch((err) => {
            setLoader(false);
            alert("Có lỗi xảy ra! Vui lòng thử lại")
        })
    }

    return (
        <ScrollView bounces={false} style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handlePullDown}
                />
            }
        >
            <View style={styles.infoWrapper}>
                <View style={styles.avatarCoverWrapper}>
                    <TouchableOpacity activeOpacity={0.8}>
                        <Image style={styles.cover} source={{ uri: user.cover_image }} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.btnChangeCover}>
                        <FontAwesome5Icon size={18} name="camera" />
                    </TouchableOpacity> */}
                    <View style={styles.avatarWrapper}>
                        <TouchableOpacity activeOpacity={0.9}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.btnChangeAvatar}>
                            <FontAwesome5Icon size={18} name="camera" />
                        </TouchableOpacity> */}
                    </View>
                </View>
                <View style={styles.introWrapper}>
                    <Text style={styles.name}>{user.username}</Text>
                    <Text style={styles.subName}>{user.subName}</Text>
                    <Text style={styles.description}>{user.description}</Text>
                    <View style={styles.introOptionsWrapper}>
                        {
                            isMe? 
                            (
                                <TouchableOpacity activeOpacity={0.8} style={styles.btnAddStory}>
                                    <FontAwesome5Icon size={16} color="#fff" name="plus-circle" />
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', marginLeft: 5 }}>Thêm store của bạn</Text>
                                </TouchableOpacity>
                            ) 
                            : 
                            (
                                isFriend?  
                                (
                                    <TouchableOpacity activeOpacity={0.8} style={styles.btnAddStory} onPress={()=>{handleBlock()}}>
                                        <FontAwesome5Icon size={16} color="#fff" name="plus-circle" />
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', marginLeft: 5 }}>Chặn</Text>
                                    </TouchableOpacity>
                                ) 
                                : 
                                ( !isRequest && 
                                    <TouchableOpacity activeOpacity={0.8} style={styles.btnAddStory} onPress={()=>{handleSendRequest()}}>
                                        <FontAwesome5Icon size={16} color="#fff" name="plus-circle" />
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', marginLeft: 5 }}>Gửi lời mời kết bạn</Text>
                                    </TouchableOpacity>
                                )
                                
                            )
                        }
                        
                        <TouchableOpacity activeOpacity={0.8} style={styles.btnOption}>
                            <FontAwesome5Icon size={20} color="#000" name="ellipsis-h" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.introListWrapper}>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="home" />
                        <Text style={styles.introLineText}>
                            Sống ở <Text style={styles.introHightLight}>{user.address}</Text>
                        </Text>
                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="map-marker-alt" />
                        <Text style={styles.introLineText}>
                            From <Text style={styles.introHightLight}>{user.city}</Text>
                        </Text>
                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="globe" />
                        <Text style={styles.introLineText}>
                            Đất nước <Text style={styles.introHightLight}>{user.country}</Text>
                        </Text>
                    </View>
                    {/* <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="rss" />
                        <Text style={styles.introLineText}>
                            Theo dõi <Text style={styles.introHightLight}>{user.listing} </Text> theo dõi
                        </Text>
                    </View> */}

                </View>
                <View style={{ paddingVertical: 20, borderBottomWidth: 0.5, borderBottomColor: '#ddd' }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnEditPublicDetail}
                        onPress={() => props.navigation.navigate("EditPublicInfo", { user: user })}>
                        <Text style={{ color: '#318bfb', fontSize: 16, fontWeight: '500' }}>Chỉnh sửa thông tin cá nhân</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loader && <LottieView source={require('../../assets/icon/loader2.json')} autoPlay loop />}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {

    },
    infoWrapper: {
        paddingTop: STATUSBAR_HEIGHT,
        padding: 15,
        backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    avatarCoverWrapper: {
        paddingBottom: 90,
        position: 'relative'
    },
    cover: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: "#ddd"
    },
    avatarWrapper: {
        backgroundColor: '#000',
        position: 'absolute',
        borderRadius: 2000,
        left: (SCREEN_WIDTH - 30 - 180) / 2, //paddingHorizontal - avatarWidth
        bottom: 0
    },
    avatar: {
        height: 180,
        width: 180,
        borderRadius: 2000,
        borderColor: '#fff',
        borderWidth: 5
    },
    btnChangeCover: {
        backgroundColor: '#fff',
        position: 'absolute',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 2.5,
        bottom: 90 + 10,
        right: 10

    },
    btnChangeAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 50,
        width: 45,
        height: 45,
        borderWidth: 2.5,
        borderColor: '#fff',
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    introWrapper: {
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.5
    },
    name: {
        fontSize: 24,
        fontWeight: '500'
    },
    subName: {
        fontSize: 20,
        fontWeight: '500'
    },
    description: {
        color: 'rgba(0,0,0,0.7)',
        marginTop: 10
    },
    introOptionsWrapper: {
        marginTop: 15,
        flexDirection: 'row'
    },
    btnAddStory: {
        backgroundColor: '#318bfb',
        borderRadius: 5,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH - 30 - 50 - 10, //paddingHorizontal optionBtnWidth, marginLeft
    },
    btnOption: {
        marginLeft: 10,
        borderRadius: 5,
        height: 40,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd'
    },
    introListWrapper: {
        paddingVertical: 10
    },
    introLine: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center'
    },
    introIcon: {
        width: 30,
    },
    introLineText: {
        fontSize: 16,
        fontWeight: '400'
    },
    introHightLight: {
        fontWeight: 'bold',
        fontSize: 16
    },
    highlightPhotosWrapper: {
        flexDirection: 'row',
        borderRadius: 10,
        flexWrap: 'wrap',
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    highLightPhoto: {
    },
    photo: {
        width: (SCREEN_WIDTH - 42) / 3,
        height: (SCREEN_WIDTH - 42) / 3
    },
    btnEditPublicDetail: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9dd0eb',
        width: '100%',
        height: 40,
        borderRadius: 5
    },
    friendsWrapper: {
        paddingVertical: 15
    },
    friendsBar: {
        borderRadius: 5,
        paddingVertical: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnFindFriends: {
        paddingHorizontal: 10
    },
    friendGallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    friendItem: {
        width: (SCREEN_WIDTH - 30 - 20) / 3,
        marginBottom: 15
    },
    friendAvatar: {
        width: (SCREEN_WIDTH - 30 - 20) / 3,
        height: (SCREEN_WIDTH - 30 - 20) / 3,
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: '#333'
    },
    btnViewAllFriends: {
        width: '100%',
        borderRadius: 5,
        height: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navigationsWrapper: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginTop: 15,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        height: 100,
        width: SCREEN_WIDTH,
        paddingHorizontal: 10
    },
    navigation: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#ddd',
        borderRadius: 48,
        marginHorizontal: 5
    },
    lastNavigation: {
        marginRight: 25
    },
    navigationIcon: {
        width: 30,
        alignItems: "center"
    }
})
