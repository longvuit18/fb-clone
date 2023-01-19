import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { SCREEN_WIDTH } from '../../constants'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

export default function index(props) {
    var user = {
        cover_url: "https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.6435-9/60214395_2000493243580749_5858994458770538496_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=e3f864&_nc_ohc=jobpkhqKfHkAX_sU80J&_nc_ht=scontent.fsgn2-2.fna&oh=00_AfBczvbUpu4ha4QN4uJzkD7Q7rPNSlc4DuG633m2TM8RSQ&oe=63CFD0B5",
        avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/314965434_2890110954618969_4295270053510347243_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Q_1x_WBiZvcAX_gY8B3&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfCPWJr3uoCRqoi5OecRbpvX6ePTOzYDgJ-lAWszXiNkfA&oe=63ACDB13",
        name: "Nguyễn Đức Nguyên",
        subName: "",
        introTxt: "",
        work_at: "HEBELA",
        live_in: "Hà Nội",
        from: "Thanh Hoá",
        relationship: "Hẹn hò",
        follower: 325,
        links: {
            github: "https://github.com/bim81929",
            repl: ""
        }
    }
    return (
        <ScrollView bounces={false} style={styles.container}>
            <View style={styles.infoWrapper}>
                <View style={styles.avatarCoverWrapper}>
                    <TouchableOpacity activeOpacity={0.8}>
                        <Image style={styles.cover} source={{ uri: user.cover_url }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnChangeCover}>
                        <FontAwesome5Icon size={18} name="camera" />
                    </TouchableOpacity>
                    <View style={styles.avatarWrapper}>
                        <TouchableOpacity activeOpacity={0.9}>
                            <Image style={styles.avatar} source={{ uri: user.avatar_url }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnChangeAvatar}>
                            <FontAwesome5Icon size={18} name="camera" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.introWrapper}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.subName}>{user.subName}</Text>
                    <Text style={styles.introTxt}>{user.introTxt}</Text>
                    <View style={styles.introOptionsWrapper}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btnAddStory}>
                            <FontAwesome5Icon size={16} color="#fff" name="plus-circle" />
                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', marginLeft: 5 }}>Add to your story</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btnOption}>
                            <FontAwesome5Icon size={20} color="#000" name="ellipsis-h" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.introListWrapper}>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="briefcase" />
                        <Text style={styles.introLineText}>
                            Work at <Text style={styles.introHightLight}>{user.work_at}</Text>
                        </Text>
                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="home" />
                        <Text style={styles.introLineText}>
                            Live in <Text style={styles.introHightLight}>{user.live_in}</Text>
                        </Text>
                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="map-marker-alt" />
                        <Text style={styles.introLineText}>
                            From <Text style={styles.introHightLight}>{user.from}</Text>
                        </Text>
                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="heart" />
                        <Text style={styles.introLineText}>
                            Relationship <Text style={styles.introHightLight}>{user.relationship}</Text>
                        </Text>
                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="rss" />
                        <Text style={styles.introLineText}>
                            Followed by <Text style={styles.introHightLight}>{user.follower} </Text>followers
                        </Text>
                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="github" />
                        <TouchableOpacity>
                            <Text style={styles.introLineText}>
                                {user.links.github}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="link" />
                        <TouchableOpacity>
                            <Text style={styles.introLineText}>
                                {user.links.repl}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.introLine}>
                        <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="ellipsis-h" />
                        <TouchableOpacity>
                            <Text style={styles.introLineText}>
                                View more introductory information
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={{ paddingVertical: 20, borderBottomWidth: 0.5, borderBottomColor: '#ddd' }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnEditPublicDetail}>
                        <Text style={{ color: '#318bfb', fontSize: 16, fontWeight: '500' }}>Edit public info</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                alignItems="center"
                bounces={false}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.navigationsWrapper}>
                <TouchableOpacity style={styles.navigation}>
                    <FontAwesome5Icon style={styles.navigationIcon} color="#000" size={20} name="images" />
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Images</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigation}>
                    <FontAwesome5Icon style={styles.navigationIcon} color="#000" size={20} name="video" />
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Videos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigation}>
                    <FontAwesome5Icon style={styles.navigationIcon} color="#000" size={20} name="calendar-week" />
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Life event</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.navigation, ...styles.lastNavigation }}>
                    <FontAwesome5Icon style={styles.navigationIcon} color="#000" size={20} name="music" />
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Music</Text>
                </TouchableOpacity>
            </ScrollView >
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {

    },
    infoWrapper: {
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
        borderTopRightRadius: 10
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
    introTxt: {
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