import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { categoryData } from '../components/categories'; // Ensure the correct path
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fonts } from '../utilities/fonts';

export default function Categories({ categories, activeCategory, handleChangeCategory }) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        className="space-x-4"
      >
        {categories.map((category, index) => {
          let isActive = category.strCategory === activeCategory;
          let activeButtonClass = isActive ? "bg-[#ff8271]" : "bg-black/10";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(category.strCategory)}
              className="flex items-center space-y-1"
            >
              <View className={"rounded-xl p-[6px] " + activeButtonClass}>
                <Image
                  source={{
                    uri: category.strCategoryThumb,
                  }}
                  style={{
                    width: hp(6),
                    height: hp(6),
                  }}
                  className="rounded-full"
                />
              </View>
              <Text
                className="text-neutral-800"
                style={{
                  fontSize: hp(1.6),
                  fontFamily: fonts.Regular,
                }}
              >
                {category.strCategory}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
