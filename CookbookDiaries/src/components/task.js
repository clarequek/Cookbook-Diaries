import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

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
            
            <View style = {styles.circular}>

            </View>
        </View>
    )
}

export default Task

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#FFF",
        padding: 15, 
        borderRadius: 10,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20, 
    },
    itemLeft: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flexWrap: 'wrap' //wrap to next line if it gets too long
    },
    checkbox: {
        width: 24, 
        height: 24,
        backgroundColor: "blue", 
        opacity: 0.4,
        borderRadius: 5, 
        marginRight: 14,
    },
    itemText: {
        maxWidth: '80%',

    },
    circular: {
        width: 12, 
        height: 12, 
        borderColor : "blue", 
        borderWidth: 2, 
        borderRadius: 5

    },
})