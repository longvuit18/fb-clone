import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Clipboard } from 'react-native'
import Toast from 'react-native-root-toast';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import ExTouchableOpacity from '../../components/ExTouchableOpacity';
export default function FriendOptions(props) {
    return (
      <View style={styles.container}>
        <View style={styles.backdrop}>
          <ExTouchableOpacity style={{ width: '100%', height: '100%' }}>
  
          </ExTouchableOpacity>
        </View>
        <View style={styles.postOptionsWrapper}>
          <TouchableOpacity style={styles.postOptionItemWrapper}>
            <View style={styles.postOptionItem}>
              <View style={styles.optionIcon}><FontAwesome5Icon name="bookmark" size={24}></FontAwesome5Icon></View>
              <View>
                <Text style={styles.postOptionTitle}>View {"friend.name"}'s friends</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postOptionItemWrapper}>
            <View style={styles.postOptionItem}>
              <View style={styles.optionIcon}><FontAwesome5Icon name="minus-square" size={24}></FontAwesome5Icon></View>
              <View>
                <Text style={styles.postOptionTitle}>Send message to {"friend.name"}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postOptionItemWrapper}>
            <View style={styles.postOptionItem}>
              <View style={styles.optionIcon}><FontAwesome5Icon name="globe-asia" size={24}></FontAwesome5Icon></View>
              <View>
                <Text style={styles.postOptionTitle}>Unfollow {"friend.name"}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postOptionItemWrapper}>
            <View style={styles.postOptionItem}>
              <View style={styles.optionIcon}><FontAwesome5Icon name="trash-alt" size={24}></FontAwesome5Icon></View>
              <View>
                <Text style={styles.postOptionTitle}>Block {"friend.name"}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postOptionItemWrapper}>
            <View style={styles.postOptionItem}>
              <View style={styles.optionIcon}><FontAwesome5Icon name="history" size={24}></FontAwesome5Icon></View>
              <View>
                <Text style={styles.postOptionTitle}>Remove {"friend.name"} in friends list</Text>
              </View>
            </View>
          </TouchableOpacity>
  
        </View>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      height: "100%",
      width: '100%',
      position: 'relative',
  
    },
    backdrop: {
      height: '100%',
      width: '100%',
      zIndex: 1
    },
    postOptionsWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 2,
      padding: 15,
      backgroundColor: '#fff',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 15,
    },
    postOptionItemWrapper: {
      paddingBottom: 20
    },
    postOptionItem: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    optionIcon: {
      width: 35,
      alignItems: 'center'
    },
    postOptionTitle: {
      fontSize: 16
    },
    postOptionSubtitle: {
      fontSize: 12
    }
  })
  