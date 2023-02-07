import React, { Component, useState } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import ExTouchableOpacity from '../ExTouchableOpacity'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { SCREEN_WIDTH } from '../../constants'

export default function Pages(props) {
    const [hidden, isShowPreview, showAllFn] = useState(true)
    let pages = [props.pages]
    if (isShowPreview) pages = pages.splice(0, 4)
    return (
        <View
            style={{ ...styles.container, display: hidden ? 'none' : 'flex' }}>
            {pages.map((page, index) => (
                <ExTouchableOpacity
                    key={index}
                    onPress={this.onPressViewPageHandler.bind(this, page.id)}
                    style={{ ...styles.pageItem, borderBottomWidth: index === pages.length - 1 ? 0 : 0.5 }}>
                    <Image style={styles.pageAvatar} source={{ uri: page.avatar_url }} />
                    <View style={styles.pageInfo}>
                        <Text style={styles.pageName}>{page.name}</Text>
                        <Text style={styles.pageoLiveIn}>{page.like_count > 1000
                            ? Math.round(page.like_count / 1000) + 'k' : page.like_count} people liked </Text>
                    </View>
                    <ExTouchableOpacity style={styles.btnAddFriend}>
                        <FontAwesome5Icon name="thumbs-up" color="#333" size={20} />
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
    pageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#ddd'
    },
    pageAvatar: {
        width: 64,
        height: 64,
        borderRadius: 64
    },
    pageInfo: {
        width: SCREEN_WIDTH - 20 - 30 - 64 - 30, //
        paddingHorizontal: 10
    },
    pageName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    pageoLiveIn: {
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
