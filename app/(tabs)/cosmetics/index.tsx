/**
 * 화장대 화면
 */

import SecondaryActionButton from "@/src/components/SecondaryActionButton";
import Tag from "@/src/components/Tag";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { CosmeticsContext } from "@/src/contexts/CosmeticsContext";
import { UserContext } from "@/src/contexts/UserContext";
import { router, useFocusEffect } from "expo-router";
import React, { useContext } from "react";
import { Image, ImageSourcePropType, Pressable, Text } from "react-native";
import { View } from "react-native";

function NoCostmetics() : React.JSX.Element {
    return (
        <View style={{ paddingBottom: 12, flex: 1, justifyContent: 'space-between'}}>
            <View style={{gap: 16}}>
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                        gap: 12,
                        borderRadius: 16,
                        backgroundColor: Colors.background.card,
                        borderColor: Colors.border.defaultLight,
                        borderWidth: 1,

                    }}
                >
                    <Text style={Typography.text.accent}>아직 등록하신 제품이 없어요</Text>
                    <Text style={[Typography.text.small, {color: Colors.text.secondary}]}>쓰시는 제품을 넣어두시면, 피부가 뒤집힌 날 무엇을 멈춰야 할지 짚어드릴 수 있어요.</Text>
                </View>
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                        gap: 10,
                        borderRadius: 16,
                        backgroundColor: Colors.background.subtle,

                    }}
                >
                    <Text style={[Typography.label.default, {color: Colors.text.secondary}]}>한 개만 넣으셔도 됩니다</Text>
                    <Text style={Typography.secondary.default}>앞면을 찍으면 이름을 읽어드리고{'\n'}뒷면 성분표는 건너뛰셔도 등록이 끝납니다</Text>
                </View>
            </View>
            <SecondaryActionButton text="제품 등록하기" onPress={()=>{router.push('/scan')}} />
        </View>
    )
}

type cosmetic = {
    id: number,
    
    frontImageUri: ImageSourcePropType | null
    brandName: string | null
    productName: string
    skincareFunction: string | null

    ingredients: string[] | null
    featureTags: string[] | null
    
    openedDate: string,
    usingTime: string,
}

type CostmeticsListprops = {
    cosmeticsList: cosmetic[]
};

function CostmeticsList({cosmeticsList}: CostmeticsListprops) : React.JSX.Element {
    return (
        <View style={{ paddingBottom: 12, flex: 1, justifyContent: 'space-between'}}>
            <View style={{gap: 12}}>
                <Text style={[Typography.secondary.small, {color: Colors.text.secondary}]}>제품을 팔지 않고 제휴도 받지 않습니다</Text>
                {cosmeticsList.map((cosmetics, index) => (
                    <Cosmetics cosmetics={cosmetics} key={index} />
                ))}
            </View>
            <SecondaryActionButton text="제품 등록하기" onPress={()=>{router.push('/scan')}} />
        </View>
    )
}

type Costmeticsprops = {
    cosmetics: cosmetic
};

function Cosmetics({
    cosmetics
}: Costmeticsprops): React.JSX.Element {
    return (
        <Pressable
            onPress={()=>{
                router.push(`/(tabs)/cosmetics/${cosmetics.id}`);
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 18,
                paddingVertical: 12,
                gap: 12,
                borderRadius: 16,
                backgroundColor: Colors.background.card,
                borderColor: Colors.border.defaultLight,
                borderWidth: 1,
            }}
        >
            <View
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: Colors.background.subtle,
                    borderColor: Colors.sand[400],
                    borderWidth: 1,
                }}
            >
                {cosmetics.frontImageUri ? <Image style={{width: 50, height: 50, borderRadius: 10}} source={{uri: cosmetics.frontImageUri}} /> : <></>}
            </View>
            <View style={{gap: 4, flex: 1}}>
                <Text style={Typography.text.accent}>{cosmetics.brandName} · {cosmetics.productName} {cosmetics.skincareFunction}</Text>
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
        </Pressable>
    )
}

export default function CosmeticsScreen() {
    const context = useContext(CosmeticsContext);
    
    const user = useContext(UserContext);

    useFocusEffect(()=>{
        user?.setIsReading(false);
    });
    return (
        <>
            <View style={{paddingTop: 16, paddingHorizontal: 16, gap: 16, flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                <Text style={Typography.title.default}>화장대</Text>
                {context?.cosmetics ? (context.cosmetics.length > 0 && <Text style={[Typography.label.default, {color: Colors.text.secondary}]}>{context.cosmetics.length}개</Text>) : <></>}
                </View>
                {context?.cosmetics ? (context.cosmetics.length > 0 ? <CostmeticsList cosmeticsList={context.cosmetics}/> : <NoCostmetics />) : <></>}
            </View>
        </>
    )
}