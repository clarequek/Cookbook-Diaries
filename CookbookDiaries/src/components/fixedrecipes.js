import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FixedRecipesCard from './recipescardfixed'; // Assuming this component exists
import { useNavigation } from "@react-navigation/native";

const FixedRecipes = ({ meals }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                {meals.length} Recipes
            </Text>
            <ScrollView
                //horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {meals.map((item, index) => (
                    <FixedRecipesCard key={item.idMeal} item={item} index={index} navigation={navigation} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 20,
    },
    heading: {
        fontSize: hp('2%'), // Adjust as needed
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black', // Adjust color
    },
    scrollViewContent: {
        paddingHorizontal: 10,
        alignItems: 'center', // Center items horizontally
        padding: 20,
    },
});

export default FixedRecipes;
