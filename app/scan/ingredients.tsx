/**
 * 성분표 촬영 화면
 */

import { extractOcrText, structureOcrText } from "@/src/api/vanity";
import ActionButton from "@/src/components/ActionButton";
import CameraCapture, { CameraCaptureRef } from "@/src/components/CameraCapture";
import HeaderNavigation from "@/src/components/HeaderNavigation";
import SecondaryActionButton from "@/src/components/SecondaryActionButton";
import Tag from "@/src/components/Tag";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { ScanContext } from "@/src/contexts/ScanContext";
import { router } from "expo-router";
import { useContext, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 18,
        marginBottom: 16
    },
    cameraContainer: {
        height: 230,
        borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.sand[400], borderRadius: 20,
        backgroundColor: Colors.background.subtle
    },
    card: {
        gap: 10,
        borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border.defaultLight, borderRadius: 16,
        padding: 20,
        backgroundColor: Colors.background.card
    },
    buttonContainer: {
        marginBottom: 14,
        marginTop: 8,
        gap: 12
    }
})

export default function ScanScreen() {
    const scan = useContext(ScanContext);
    const tags = ['레티놀', '산', '비타민씨'];
        const cameraRef = useRef<CameraCaptureRef>(null);
    
      const [photoUri, setPhotoUri] = useState<string | null>(null);
    
      const handleTakePhoto = async () => {
        const uri = await cameraRef.current?.takePhoto();

        if (!uri) {
            return;
        }

        console.log("성분표 촬영 완료:", uri);

        setPhotoUri(uri);
        scan?.setBackImageUri(uri);
        router.push('/scan/confirm');
/*
        try {
            const { rawText } = await extractOcrText(uri);
            console.log("[BACK OCR] rawText:", rawText);

            const structured = await structureOcrText(rawText);
            console.log("[BACK OCR] structured:", structured);

            const ingredients = structured.keyIngredients
                ? structured.keyIngredients
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean)
                : [];

            scan?.setIngredients(ingredients);
            scan?.setFeatureTags(structured.interactionTags ?? []);

            router.push('/scan/info');
        } catch (error) {
            console.error("성분표 OCR 실패:", error);

            // OCR 실패하면 기존 fallback 화면으로 이동
            router.push('/scan/fallback');
        }
            */
    };
    return (
        <>
            <View style={{paddingVertical: 18}}>
                <HeaderNavigation title="제품 등록" />
            </View>
            <ScrollView>
            <View style={ Styles.container }>
                <View style={{ gap: 8 }}>
                    <Text
                        style={Typography.title.big}
                    >뒷면 성분표도{'\n'}한 장 찍어주세요</Text>
                    <Text
                        style={[Typography.secondary.default, {color: Colors.text.secondary}]}
                    >함께 쓰면 안 되는 조합을 알려드릴 수 있어요</Text>
                </View>
                {/* 개발 필요 */}
                <View style={Styles.cameraContainer}>
                    <CameraCapture ref={cameraRef} />
                </View>
                <View style={Styles.card}>
                    <Text
                        style={[Typography.label.default, {color:Colors.text.secondary}]}
                    >이런 걸 찾아냅니다</Text>
                    {/* 성분 예시 */}
                    <View style={{ flexDirection:'row', gap: 8}}>
                        {tags.map((text, index) => (
                            <Tag
                                key={index}
                                color={Colors.border.defaultLight} textColor={Colors.text.secondary}
                                text={text}
                                backgroundColor={Colors.background.card}
                                isLarge={true}
                            />
                        ))}
                    </View>
                    <Text
                        style={[Typography.secondary.small, {color: Colors.text.muted}]}
                    >성분 전체를 저장하지 않고 이 태그만 남깁니다</Text>
                </View>
                <Text
                    style={[Typography.secondary.small, {color: Colors.text.secondary}]}
                >건너뛰셔도 등록은 끝납니다. 나중에 추가하셔도 돼요.</Text>
            </View>
            </ScrollView>

            <View style={Styles.buttonContainer}>
                <ActionButton
                    text="촬영"
                    onPress={handleTakePhoto}
                />
                <SecondaryActionButton text="건너뛰기" onPress={()=>{router.push('/scan/info')}} />
            </View>
        </>
    )
}