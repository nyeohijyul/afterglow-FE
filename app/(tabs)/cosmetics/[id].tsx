/**
 * 화장대 화면
 */

import HeaderNavigation from "@/src/components/HeaderNavigation";
import SecondaryActionButton from "@/src/components/SecondaryActionButton";
import Tag from "@/src/components/Tag";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { CosmeticsContext } from "@/src/contexts/CosmeticsContext";
import { ScanContext } from "@/src/contexts/ScanContext";
import { UserContext } from "@/src/contexts/UserContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Image, Text } from "react-native";
import { View } from "react-native";

export default function CosmeticsScreen() {
    const {id} = useLocalSearchParams<{id:string}>()
    const cosmeticId = parseInt(id);
    const cosmeticlist = useContext(CosmeticsContext);
    const user = useContext(UserContext);
    const scan = useContext(ScanContext);
    useFocusEffect(() => user?.setIsReading(true));
    const getexampleCosmetic = () => (cosmeticlist?.cosmetics[cosmeticId] ?? {
        id: 0,
        frontImageUri: require('@/assets/images/product1.png'),
        brandName: '라로슈포제',
        productName: '시카플라스트 밤 b5+',
        skincareFunction: '시카 밤',

        ingredients: ["트라이바이오마", "판테놀", "마데카소사이드"],
        featureTags: ["고보습", "시카 밤"],

        openedDate: scan?.openedDate ?? '',
        usingTime: scan?.usingTime ?? ''
    });
    const cosmetics = getexampleCosmetic();
    return (
        <>
            <View style={{paddingTop: 16, paddingHorizontal: 16, gap: 16, flex: 1}}>
                <HeaderNavigation title="화장대"/>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                    }}
                >
                    <View
                        style={{
                            width: 76,
                            height: 76,
                            borderRadius: 12,
                            backgroundColor: Colors.background.subtle,
                            borderColor: Colors.sand[400],
                            borderWidth: 1,
                        }}
                    >
                        {cosmetics.frontImageUri && <Image style={{width: 76, height: 76, borderRadius: 12}} source={{uri: cosmetics.frontImageUri}} />}
                    </View>
                    <View style={{gap: 4, flex: 1}}>
                        <Text style={[Typography.secondary.default, {color: Colors.text.secondary}]}>{cosmetics.brandName}</Text>
                        <Text style={Typography.title.small}>{cosmetics.productName}</Text>
                        <Text style={[Typography.secondary.small, {color: Colors.text.secondary}]}>{cosmetics.skincareFunction}</Text>
                    </View>
                </View>
                <View style={{gap: 8}}>
                    <Text style={[Typography.label.default, {color: Colors.text.secondary}]}>성분 태그</Text>
                    <View style={{gap: 8, flexDirection: 'row', alignItems: 'center'}}>
                        {cosmetics.ingredients && cosmetics.ingredients.map((tag, index)=> (
                            <Tag
                                key={index}
                                color={Colors.border.defaultLight} textColor={Colors.text.secondary}
                                text={tag}
                                backgroundColor={Colors.background.card}
                            />
                        ))}
                    </View>
                </View>
                <View style={{gap: 8}}>
                    <Text style={[Typography.label.default, {color: Colors.text.secondary}]}>기능 태그</Text>
                    <View style={{gap: 8, flexDirection: 'row', alignItems: 'center'}}>
                        {cosmetics.featureTags && cosmetics.featureTags.map((tag, index)=> (
                            <Tag
                                key={index}
                                color={Colors.border.defaultLight} textColor={Colors.text.secondary}
                                text={tag}
                                backgroundColor={Colors.background.card}
                            />
                        ))}
                        <Text style={[Typography.secondary.small, {color: Colors.text.secondary}]}>개봉: {cosmetics.openedDate}</Text>
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                        gap: 8,
                        borderRadius: 16,
                        backgroundColor: Colors.background.card,
                        borderColor: Colors.border.defaultLight,
                        borderWidth: 1,

                    }}
                >
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={[Typography.secondary.default, {color: Colors.text.secondary}]}>쓰는 때</Text>
                        <Text style={Typography.text.accent}>{cosmetics.usingTime}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={[Typography.secondary.default, {color: Colors.text.secondary}]}>쓰기 시작</Text>
                        <Text style={Typography.text.accent}>{cosmetics.openedDate}</Text>
                    </View>
                </View>
            </View>
        </>
    )
}