import React, { Component, useState } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import GroupCategoryItem from './GroupCategoryItem'

export default function index(props) {
    // const category = props;
    const [category, setCategory] = useState(props);
    return (
        <ScrollView style={styles.container} bounces={false}>
            {groupCategories.map((category, index) => (
                <View key={index}>
                    {category.isPopular && (
                        <GroupCategoryItem category={category} key={index} />
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.2,
    }
})