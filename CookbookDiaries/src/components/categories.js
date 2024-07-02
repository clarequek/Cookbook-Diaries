import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { categoryData } from "../constants";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fonts } from '../utilities/fonts';
import { colors } from '../utilities/colors';


export default function Categories({
    categories,
    activeCategory,
    handleChangeCategory,
}) {

    const allRecipesCategory = { strCategory: "All", strCategoryThumb: 'https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?b=1&s=612x612&w=0&k=20&c=X6CkFGpSKhNZeiii8Pp2M_YrBdqs7tRaBytkGi48a0U=' };
    const updatedCategories = [allRecipesCategory, ...categories];

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-4"
                contentContainerStyle={{
                    paddingHorizontal: 15,
                }}
            >
                {updatedCategories.map((category, index) => {
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
                                    fontFamily: fonts.SemiBold,
                                    color: colors.darkgrey,
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
