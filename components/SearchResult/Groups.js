import React, { Component, useState } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import ExTouchableOpacity from '../ExTouchableOpacity'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { SCREEN_WIDTH } from '../../constants'

export default function Groups(props) {
    const [hidden, isShowPreview, showAllFn] = useState(true)
    let groups = [props.groups]
    if (isShowPreview) groups = groups.splice(0, 4)
    return (
        <View style={{ ...styles.container, display: hidden ? 'none' : 'flex' }}>
            {groups.map((group, index) => (
                <ExTouchableOpacity
                    key={index}
                    style={{...styles.groupItem, borderBottomWidth: index === groups.length - 1 ? 0 : 0.5}}>
                    <Image style={styles.groupAvatar} source={{ uri: group.avatar_url }} />
                    <View style={styles.groupInfo}>
                        <Text style={styles.groupName}>{group.name}</Text>
                        <Text style={styles.groupoLiveIn}>{group.member > 1000
                                ? Math.round(group.member / 1000) + 'k' : group.member} members</Text>
                    </View>
                    <ExTouchableOpacity style={styles.btnAddFriend}>
                        <FontAwesome5Icon name="plus-circle" color="#333" size={20} />
                    </ExTouchableOpacity>                       
                </ExTouchableOpacity>
            ))}
            {isShowPreview &&
                <TouchableOpacity
                    style={styles.btnShowAll}
                    onPress={showAllFn}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Show All </Text>
                </TouchableOpacity>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: '#fff',
        padding: 15,
        paddingVertical: 10,
        borderColor: '#ddd',
        borderWidth: 0.5,
        borderRadius: 10
    },
    groupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#ddd'
    },
    groupAvatar: {
        width: 64,
        height: 64,
        borderRadius: 64
    },
    groupInfo: {
        width: SCREEN_WIDTH - 20 - 30 - 64 - 30, //
        paddingHorizontal: 10
    },
    groupName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    groupoLiveIn: {
        color: '#333'
    },
    btnAddFriend: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnShowAll: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#ddd',
        borderRadius: 5
    }
})