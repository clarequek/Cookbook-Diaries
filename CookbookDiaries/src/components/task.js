import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { fonts } from "../utilities/fonts"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../utilities/colors"

const Task = (props) => { 
    
    return (
        <View style = {styles.item}>
            <View style = {styles.itemLeft}>
                <TouchableOpacity 
                style = {styles.checkbox}> 
                </TouchableOpacity>
                   
                <Text style = {styles.itemText }>
                    {props.text}
                </Text>
            </View>

            <TouchableOpacity>
                <Ionicons name={"pencil-outline"} color={colors.pink} size={25} />
            </TouchableOpacity>
        </View>
    )
}

export default Task

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#FFF",
        padding: 15, 
        borderRadius: 90,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 10, 
    },
    itemLeft: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flexWrap: 'wrap' //wrap to next line if it gets too long
    },
    checkbox: {
        width: 25, 
        height: 25,
        backgroundColor: "#ff8271", 
        opacity: 0.4,
        borderRadius: 5, 
        marginRight: 14,
    },
    itemText: {
        maxWidth: '80%',
        fontSize: 16,
        fontFamily: fonts.Regular,

    },
    circular: {
        width: 12, 
        height: 12, 
        borderColor : "#ff8271", 
        borderWidth: 2, 
        borderRadius: 5

    },
})