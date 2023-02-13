import React, { useEffect, PureComponent, useState } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, RefreshControl, StatusBar, ActivityIndicator, SafeAreaView } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { getData, getDataObject, IUser, useStore, storeDataObject, removeDataStore } from '../../store';
import axios from "axios";
import LottieView from 'lottie-react-native';
import Post from '../../components/Post';
import { useNetInfo } from "@react-native-community/netinfo";

interface IPost {
    id?: string;
    authorName?: string;
    urlAvatar?: string;
    timePost?: string;
    contentPost?: string;
    numberImage?: string;
    hasVideo?: boolean;
    hasMedia?: boolean;
    urlImage?: object;
    numberLike?: object;
    textComment?: string;
    isLiked?: boolean;
    status?: string;
    canEdit?: boolean
}

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
    const [data, setData] = React.useState<IPost[]>([])
    const { state, dispatch } = useStore();
    const authorId = route.params ? (route.params.authorId ? route.params.authorId : null) : null;

    const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getTimeBetweenTwoDate = (firstDate: Date, secondDate: Date) => {
        const seconds = (secondDate.getTime() - firstDate.getTime()) / 1000;
        if (seconds < 60) {
            return "Vừa xong";
        }
        else if (seconds < 3600) {
            let minutes = Math.ceil(seconds / 60);
            return minutes + " phút";
        }
        else if (seconds < 86400) {
            let hours = Math.ceil(seconds / 3600);
            return hours + " giờ";
        }
        else if (seconds < 432000) {
            let days = Math.ceil(seconds / 86400);
            return days + " ngày";
        }
        else {
            return firstDate.getDate() + " thg " + (firstDate.getMonth() + 1) + ", " + firstDate.getUTCFullYear()
        }
    }
    const netInfo = useNetInfo();

    const getPost = async (isLoadMore: boolean, isRefresh: boolean, isFirst: boolean) => {
        var userId = state.user.id;
        let last_id = "0";
        if (!refreshing && isLoadMore) {
            if (data.length > 0) {
                last_id = data[data.length - 1].id;
            }
            setIsLoading(true);
        }
        try {
            var id = state.user.id;
            if (!isMe) {
                id = authorId
            }

            const posts = await axios.post(`/post/get_list_posts?last_id=${last_id}&index=0&count=100`)
            const mapData = posts.data.data.posts.map((post: any) => {
                if (post.author.id == id) {
                    let createdDate = new Date(Number.parseInt((post.created * 1000).toString()));
                    let now = new Date();
                    let timePost = getTimeBetweenTwoDate(createdDate, now);
                    let urlImage: any[] = [];
                    let numberImage = post.image ? post.image.length : 0;
                    if (numberImage > 0) {
                        post.image.forEach((image: any) => {
                            return urlImage.push(image.url)
                        })
                    }

                    return ({
                        id: post.id,
                        authorName: post.author.username ? post.author.username : (post.author.id == userId ? 'Me' : 'Unknow'),
                        urlAvatar: post.author.avatar ? post.author.avatar : 'https://i.ibb.co/GsY7vbz/contacts-64.png',
                        contentPost: post.described,
                        numberImage: post.image ? post.image.length : 0,
                        timePost: timePost,
                        hasVideo: false,
                        hasMedia: post.image || post.video ? true : false,
                        urlImage: urlImage,
                        numberLike: post.like,
                        textComment: post.comment + ' bình luận',
                        isLiked: post.is_liked == "1" ? true : false,
                        status: post.state,
                        canEdit: post.author.id == state.user.id ? true : false,
                    }
                    )
                } else {
                    return null;
                }
            }).filter(elements => {
                return elements !== null;
            });
            var listPost = [];
            if(isRefresh || isFirst){
                listPost = [...mapData];
            }
            else{
                listPost = [...data, ...mapData];
            }
            const uniqueArray = listPost.filter((value, index) => {
                const _value = JSON.stringify(value);
                return index === listPost.findIndex(obj => {
                    return JSON.stringify(obj) === _value;
                });
            });
            setData([...[]])
            setData([...uniqueArray]);
            setIsLoading(false);
            setRefreshing(false);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            //console.error(error.response.data)
            throw error;
        }
    }

    const handleScrollEndList = async () => {
        setIsLoadMore(true);
        await getPost(true, false, false);
        setIsLoadMore(false);
    }

    const isMe = (authorId == state.user.id || authorId == null);
    const [isRequest, setIsRequest] = useState<boolean>(false)

    const [isFriend, setIsFriend] = useState<boolean>(false);
    useEffect(() => {
        setLoader(true);
        setIsLoading(true);
        getCacheRequest();
        getProfile();
        getPost(false, false, true);
    }, [authorId])

    const getCacheRequest = async () => {
        var key = `requestFriend_${authorId}_${state.user.id}`;
        var obj = await getDataObject(key)
        if (obj) {
            setIsRequest(true);
        }
        else {
            setIsRequest(false);
        }

    }

    const handlePullDown = async () => {
        setRefreshing(true);
        await getProfile();
        await getPost(false, true, false);
    }


    const getProfile = async () => {
        setUser({
            cover_image: undefined,
            avatar: undefined,
            username: "",
            subName: "",
            description: "",
            address: "",
            city: "",
            listing: "",
            country: "",
        });
        try {
            var id = state.user.id;
            if (!isMe) {
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
                var key = `requestFriend_${authorId}_${state.user.id}`;
                removeDataStore(key);
                storeDataObject(key, { check: true });
                setIsRequest(true);
            })
            .catch((err) => {
                setLoader(false);
                alert("Có lỗi xảy ra! Vui lòng thử lại")
            })
    }
    const callBackEventPost = async (type: any, index: number) => {
        if(type == 0){
            var tempData = data;
            tempData.splice(index, 1);
            //Chả hiểu sao nó lại không ăn render. nên phải xoá hết đi rồi mới vẽ lại
            setData([]);
            setData([...tempData]);
          }
          else{
            await handlePullDown();
          }
    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    return (
        <SafeAreaView style={styles.container}>
            {refreshing ?
                <ActivityIndicator /> :
                <ScrollView bounces={false} style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handlePullDown}
                        />
                    }
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            handleScrollEndList();
                        }
                    }}
                    scrollEventThrottle={16}
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
                                    isMe ?
                                        (
                                            <TouchableOpacity activeOpacity={0.8} style={styles.btnAddStory}>
                                                <FontAwesome5Icon size={16} color="#fff" name="plus-circle" />
                                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', marginLeft: 5 }}>Thêm store của bạn</Text>
                                            </TouchableOpacity>
                                        )
                                        :
                                        (
                                            isFriend ?
                                                (
                                                    <TouchableOpacity activeOpacity={0.8} style={styles.btnAddStory} onPress={() => { handleBlock() }}>
                                                        <FontAwesome5Icon size={16} color="#fff" name="plus-circle" />
                                                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', marginLeft: 5 }}>Chặn</Text>
                                                    </TouchableOpacity>
                                                )
                                                :
                                                (!isRequest &&
                                                    <TouchableOpacity activeOpacity={0.8} style={styles.btnAddStory} onPress={() => { handleSendRequest() }}>
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
                            {isMe &&
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btnEditPublicDetail}
                                    onPress={() => props.navigation.navigate("EditPublicInfo", { user: user })}>
                                    <Text style={{ color: '#318bfb', fontSize: 16, fontWeight: '500' }}>Chỉnh sửa thông tin cá nhân</Text>
                                </TouchableOpacity>
                            }

                        </View>
                    </View>
                    {data.map((post, index) => (
                        <TouchableOpacity key={"post" + index}>
                            {data.length !== 0
                                ? (<Post indexPost={index} data={post} navigation={props.navigation} callBackEvent={callBackEventPost} />)
                                : (<View><Text>Không có bài viết</Text></View>)}
                        </TouchableOpacity>
                    ))}
                    
                    {loader && <LottieView source={require('../../assets/icon/loader.json')} autoPlay loop />}
                    {isLoading && <ActivityIndicator size="large" color='#babec5' />}
                </ScrollView>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#cbccd1',
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
    resultWrapper: {
        height: SCREEN_HEIGHT - STATUSBAR_HEIGHT - 50 - 48
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 36,
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
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
