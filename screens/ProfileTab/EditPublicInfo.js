import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '../../constants'
import ExTouchableOpacity from '../../components/ExTouchableOpacity'

export default function EditPublicInfo(props) {
  var userInfo = {
    cover_url: "https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.6435-9/60214395_2000493243580749_5858994458770538496_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=e3f864&_nc_ohc=jobpkhqKfHkAX_sU80J&_nc_ht=scontent.fsgn2-2.fna&oh=00_AfBczvbUpu4ha4QN4uJzkD7Q7rPNSlc4DuG633m2TM8RSQ&oe=63CFD0B5",
    avatar_url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-9/41585523_2191322511147619_4326148844468305920_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=OkVD7j2cUJMAX9UnJOF&tn=5-cCzEExNYSV7PRA&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfDpMaSiA0Wy_rStYQdrVt6P-QgjoOt6_Zcy1j5p7VE_Og&oe=63CFC9A1",
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
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <ExTouchableOpacity style={styles.btnBack}>
          <FontAwesome5Icon name="arrow-left" color="#000" size={20} />
        </ExTouchableOpacity>
        <Text style={styles.navigationTitle}>Edit your profile</Text>
      </View>
      <ScrollView bounces={false} style={styles.detailsWrapper}>
        <View style={{ ...styles.detail, paddingTop: 0 }}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Avatar</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: userInfo.avatar_url }} style={styles.avatar}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Cover</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: userInfo.cover_url }} style={styles.cover}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Introduction</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.introTxt}>{userInfo.introTxt}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Details</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.introListWrapper}>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="briefcase" />
              <Text style={styles.introLineText}>
                Work at <Text style={styles.introHightLight}>{userInfo.work_at}</Text>
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="home" />
              <Text style={styles.introLineText}>
                Live in <Text style={styles.introHightLight}>{userInfo.live_in}</Text>
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="map-marker-alt" />
              <Text style={styles.introLineText}>
                From <Text style={styles.introHightLight}>{userInfo.from}</Text>
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="heart" />
              <Text style={styles.introLineText}>
                Relationship <Text style={styles.introHightLight}>{userInfo.relationship}</Text>
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="rss" />
              <Text style={styles.introLineText}>
                Followed by <Text style={styles.introHightLight}>{userInfo.follower} </Text>followers
              </Text>
            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="github" />
              <TouchableOpacity>
                <Text style={styles.introLineText}>
                  {userInfo.links.github}
                </Text>
              </TouchableOpacity>

            </View>
            <View style={styles.introLine}>
              <FontAwesome5Icon size={20} color="#333" style={styles.introIcon} name="link" />
              <TouchableOpacity>
                <Text style={styles.introLineText}>
                  {userInfo.links.repl}
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
        </View>
        <View style={styles.detail}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>Hobbies</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ ...styles.detail }}>
          <View style={styles.detailTitleWrapper}>
            <Text style={styles.detailTitle}>HighLight Photos</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#318bfb" }}>Modify</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.9} style={styles.highlightGallery}>
          </TouchableOpacity>
        </View>
        <View activeOpacity={0.9} style={{ ...styles.detail, ...styles.lastDetail }}>
          <TouchableOpacity style={styles.btnModifyMore}>
            <FontAwesome5Icon />
            <Text style={{ color: '#318bfb', fontSize: 16, fontWeight: '500' }}>Modify introduction informations</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  navigationBar: {
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    height: 94,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  btnBack: {
    width: 50,
    alignItems: 'center'
  },
  navigationTitle: {
    fontSize: 18
  },
  detailsWrapper: {
    padding: 15,
    height: SCREEN_HEIGHT - (50 + STATUSBAR_HEIGHT)
  },
  detail: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingVertical: 15
  },
  detailTitleWrapper: {
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  avatar: {
    width: 140,
    height: 140,
    alignSelf: "center",
    borderRadius: 140
  },
  cover: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10
  },
  introTxt: {
    color: '#333',
    alignSelf: 'center',
    marginVertical: 10
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
  highlightGallery: {
    marginVertical: 10
  },
  lastDetail: {
    marginBottom: 30,
    borderBottomWidth: 0
  },
  btnModifyMore: {
    height: 40,
    width: '100%',
    backgroundColor: '#9dd0eb',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5
  }
})
