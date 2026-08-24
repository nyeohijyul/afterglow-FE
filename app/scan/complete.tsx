/**
 * 완료 화면
 */

import ActionButton from "@/src/components/ActionButton";
import HeaderNavigation from "@/src/components/HeaderNavigation";
import SecondaryActionButton from "@/src/components/SecondaryActionButton";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import AlertIcon from '@/assets/icons/alert.svg';
import { router } from "expo-router";
import { ScanContext } from "@/src/contexts/ScanContext";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        marginBottom: 16,
        marginTop: 20
    },
    alertCaption: {
        gap:10,
        backgroundColor: Colors.alert.background,
        borderRadius: 16,
        padding: 20
    },
    captionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonContainer: {
        marginBottom: 14, marginTop: 8,
        gap: 12
    }
})

export default function ScanScreen() {
    const scan = useContext(ScanContext);

    const registeredProductName = scan?.registrationResult?.product.name ?? scan?.productName ?? '';
    // openedDate/usingTime은 info.tsx에서 저장한 한글 라벨(예: '저녁', '1~3개월')을 그대로 사용.
    const subtitleParts = [scan?.productName, scan?.usingTime, scan?.openedDate ? `개봉: ${scan.openedDate}` : null]
        .filter(Boolean);

    const warnings = scan?.registrationResult?.warnings ?? [];

    return (
        <>
            <ScrollView>
            <View style={ Styles.container }>
                <View style={{ gap: 8 }}>
                    <Text
                        style={Typography.title.big}
                    >화장대에 넣었어요</Text>
                    <Text
                        style={[Typography.secondary.default, {color:Colors.text.secondary}]}
                    >{subtitleParts.join(' · ')}</Text>
                </View>
                {warnings.length > 0 && (
                    <View style={Styles.alertCaption}>
                        <View style={Styles.captionHeader}>
                            <View style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                                <AlertIcon width={16.68} height={15.01} />
                            </View>
                            <Text
                                style={[Typography.text.accent, {color: Colors.alert.text}]}
                            >같이 쓸 때 주의하세요</Text>
                        </View>
                        <View style={{gap: 10}}>
                            {warnings.map((message, index) => (
                                <Text
                                    key={index}
                                    style={[Typography.text.small, {color: Colors.alert.text}]}
                                >{message}</Text>
                            ))}
                            <Text
                                style={[Typography.secondary.small, {color: Colors.alert.text}]}
                            >금지가 아니라 주의입니다</Text>
                        </View>
                    </View>
                )}
                {/* TODO(백엔드 확인 필요): 등록된 제품 총 개수를 보여주는 API/필드가
                    아직 없어 기존의 "지금 12개가 등록돼 있어요" 문구는 제거함.
                    필요하다면 createProduct 응답이나 별도 카운트 API에 추가 필요. */}
            </View>
            </ScrollView>

            <View style={Styles.buttonContainer}>
                <ActionButton text="화장대 보기" route={'/(tabs)/cosmetics'}/>
                <SecondaryActionButton text="하나 더 등록하기" onPress={()=>router.replace('/scan')} />
            </View>
        </>
    )
}