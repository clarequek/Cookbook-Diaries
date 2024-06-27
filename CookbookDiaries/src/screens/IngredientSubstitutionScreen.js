import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import staticSubstitutions from '../constants/substitutions';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import Ionicons from 'react-native-vector-icons/Ionicons';

const IngredientSubstitutionScreen = () => {
  const navigation = useNavigation();
  const [ingredient, setIngredient] = useState('');
  const [substitutions, setSubstitutions] = useState([]);

  const fetchSubstitutions = () => {
    const subs = staticSubstitutions[ingredient.toLowerCase()] || ["Sorry! There are currently no substitutions found."];
    setSubstitutions(subs);
  };

  return (
    <View style={styles.container}>
      {/* Back button and title */}
      <View style={styles.header}>
        <TouchableOpacity className="p-2 rounded-full bg-white ml-1"
          style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon
            size={hp(3.5)}
            color={colors.pink}
            strokeWidth={4.5}
          />
        </TouchableOpacity>
        <Text className='font-extrabold' style={styles.title}>
          Ingredient Substitution
        </Text>
      </View>

      {/* Search bar + Icon */}
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={25} color={colors.darkgrey} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter an ingredient"
          value={ingredient}
          onChangeText={setIngredient}
        />
      </View>

      {/* Get substitutions Button */}
      <TouchableOpacity style={styles.button} onPress={fetchSubstitutions}>
        <Text style={styles.buttonText}>Get Substitutions</Text>
      </TouchableOpacity>

      {/* List of Substitutions */}
      <FlatList
        data={substitutions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name="leaf-outline" size={24} color={colors.pink} style={styles.cardIcon} />
            <Text style={styles.substitution}>{item}</Text>
          </View>
        )}
        //Disclaimer
        ListFooterComponent={
          <Text style={styles.disclaimer}>
            Disclaimer: The provided substitutions are suggestions and may not be suitable for all recipes or dietary needs. Please use discretion and consult a professional if needed.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: colors.cream,
    justifyContent: 'center',
  },
  backButtonWrapper: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: hp(2.7),
    color: colors.pink,
    fontFamily: fonts.Bold,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.darkgrey,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: fonts.Regular,
    fontSize: hp(2.2),
  },
  button: {
    backgroundColor: colors.pink,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.Bold,
    fontSize: hp(2.2),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 10,
  },
  substitution: {
    fontSize: hp(2),
    fontFamily: fonts.Regular,
  },
  disclaimer: {
    fontSize: hp(1.8),
    fontFamily: fonts.Italic,
    color: colors.darkgrey,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default IngredientSubstitutionScreen;
