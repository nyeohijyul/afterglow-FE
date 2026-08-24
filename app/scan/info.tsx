/**
 * 정보 (개봉일자, 사용시각) 입력 화면
 */

import ActionButton from "@/src/components/ActionButton";
import HeaderNavigation from "@/src/components/HeaderNavigation";
import SecondaryActionButton from "@/src/components/SecondaryActionButton";
import TagRadioButtonList from "@/src/components/TagRadioButtonList";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { ScanContext } from "@/src/contexts/ScanContext";
import {
    createProduct,
    CreateProductRequest,
    InteractionTag,
    OpeningPeriod,
    RegistrationSource,
    UsageTiming,
} from "@/src/api/vanity";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Alert, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { CosmeticsContext } from "@/src/contexts/CosmeticsContext";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        marginBottom: 16
    },
    card: {
        gap: 6,
        borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border.defaultLight, borderRadius: 16,
        padding: 20,
        backgroundColor: Colors.background.subtle,
    },
    buttonContainer: {
        marginBottom: 14, marginTop: 8,
        gap: 20
    }
})

const OPENING_PERIOD_MAP: Record<string, OpeningPeriod> = {
    '최근': 'RECENT',
    '1~3개월': 'ONE_TO_THREE_MONTHS',
    '6개월 이상': 'SIX_MONTHS_OR_MORE',
};

const USAGE_TIMING_MAP: Record<string, UsageTiming> = {
    '아침': 'MORNING',
    '저녁': 'EVENING',
    '둘 다': 'BOTH',
};

const REGISTRATION_SOURCE_OCR: RegistrationSource = 'PHOTO'

// TODO(제품/백엔드 확인 필요): CreateProductRequest.openedAt은 'YYYY-MM-DD' 형태의
// 구체적인 날짜를 요구하지만, 현재 UI는 "최근/1~3개월/6개월 이상" 같은 카테고리만
// 수집한다. 정확한 날짜를 알 방법이 없어 임시로 오늘 날짜를 넣는다.
// 실제 날짜 입력 UI를 추가하거나, 백엔드가 카테고리(openingPeriod)만으로
// openedAt 없이 처리 가능한지 확인이 필요하다.
function getPlaceholderOpenedAt(): string {
    return new Date().toISOString().slice(0, 10);
}

export default function ScanScreen() {
    const scan = useContext(ScanContext);
    const cosmeticlist = useContext(CosmeticsContext);
    const openedDateList = ['최근', '1~3개월', '6개월 이상'];
    const usingTimeList = ['아침', '저녁', '둘 다'];
    const [openedDate, setopenedDate] = useState('');
    const [usingTime, setusingTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!openedDate || !usingTime || isSubmitting) {
            return;
        }

        // setIsSubmitting(true);
        
            scan?.setopenedDate(openedDate);
            scan?.setusingTime(usingTime);
            cosmeticlist?.setcosmetics([...cosmeticlist.cosmetics, {
                id: cosmeticlist.cosmetics.length,
                frontImageUri: scan?.frontImageUri as ImageSourcePropType,
                brandName: scan?.brandName ?? '',
                productName: scan?.productName ?? '',
                skincareFunction: scan?.skincareFunction ?? '',
                ingredients: scan?.ingredients ?? [],
                featureTags: scan?.featureTags ?? [],
                openedDate: openedDate,
                usingTime: usingTime
            }])
            console.log(cosmeticlist?.cosmetics);
            router.push('/scan/complete');
        /*
        try {
            const payload: CreateProductRequest = {
                name: scan?.productName || '',
                brand: scan?.brandName || '',
                type: scan?.skincareFunction || '',
                keyIngredients: (scan?.ingredients ?? []).join(', '),
                // TODO(백엔드 확인 필요): 구조화 API 응답에는 "기능 태그"(예: 저자극,
                // 보습) 출처가 없어 임의로 채우지 않고 빈 배열로 둔다.
                functionTags: [],
                openedAt: getPlaceholderOpenedAt(),
                openingPeriod: OPENING_PERIOD_MAP[openedDate] ?? openedDate,
                usageTiming: USAGE_TIMING_MAP[usingTime] ?? usingTime,
                interactionTags: (scan?.featureTags ?? []) as InteractionTag[],
                registrationSource: REGISTRATION_SOURCE_OCR,
                // barcode, photoKey: 현재 플로우에는 이미지 업로드/바코드 API가
                // 제공되지 않아 생략함 (TODO: 사진을 photoKey로 남길 방법 확인 필요)
            };

            const result = await createProduct(payload);

            scan?.setopenedDate(openedDate);
            scan?.setusingTime(usingTime);
            scan?.setRegistrationResult(result);

            // 저장 성공 후에만 이동. ActionButton은 onPress를 기다리지 않고
            // route를 바로 push하므로, 여기서는 route prop을 쓰지 않고
            // 성공 시에만 수동으로 push한다.
            router.push('/scan/complete');
        } catch (error) {
            console.error('제품 등록 실패:', error);
            Alert.alert('등록 실패', '제품을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
            */
    };

    return (
        <>
            <View style={{paddingVertical: 20}}>
                <HeaderNavigation title="제품 등록" />
            </View>
            <ScrollView>
            <View style={ Styles.container }>
                <View style={{ gap: 8 }}>
                    <Text style={Typography.title.default}>언제부터, 언제 쓰세요?</Text>
                </View>
                <View style={{gap:10}}>
                    <Text
                        style={[Typography.label.default, {color: Colors.text.secondary}]}
                    >개봉한 지 얼마나 됐나요?</Text>
                    <TagRadioButtonList
                        tagList={openedDateList}
                        selected={openedDate}
                        setSelected={setopenedDate}
                    />
                    <Text
                        style={[Typography.secondary.small, {color: Colors.text.muted}]}
                    >정확하지 않아도 괜찮아요</Text>
                </View>
                <View style={{gap:10}}>
                    <Text
                        style={[Typography.label.default, {color: Colors.text.secondary}]}
                    >주로 언제 쓰세요?</Text>
                    <TagRadioButtonList
                        tagList={usingTimeList}
                        selected={usingTime}
                        setSelected={setusingTime}
                    />
                </View>
                <View style={Styles.card}>
                    <Text
                        style={[Typography.text.accent]}
                    >저희는 제품을 팔지 않습니다</Text>
                    <Text
                        style={[Typography.secondary.small, {color: Colors.text.secondary}]}
                    >제휴도 받지 않습니다</Text>
                </View>
            </View>
            </ScrollView>

            <View style={Styles.buttonContainer}>
                <ActionButton
                    text={isSubmitting ? "저장하는 중..." : "화장대에 넣기"}
                    onPress={handleSubmit}
                    disabled={!openedDate || !usingTime || isSubmitting}
                />
            </View>
        </>
    )
}