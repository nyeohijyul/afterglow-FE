import ActionButton from "@/src/components/ActionButton";
import CameraCapture, {
  CameraCaptureRef,
} from "@/src/components/CameraCapture";

import HeaderNavigation from "@/src/components/HeaderNavigation";
import SecondaryActionButton from "@/src/components/SecondaryActionButton";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { ScanContext } from "@/src/contexts/ScanContext";
import { extractOcrText, structureOcrText } from "@/src/api/vanity";
import { router } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    marginBottom: 16
  },
  cameraContainer: {
    height: 230,
    borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.sand[400], borderRadius: 20,
    backgroundColor: Colors.background.subtle
  },
  card: {
    gap: 8,
    borderStyle: 'solid', borderWidth: 1, borderColor: Colors.border.defaultLight, borderRadius: 16,
    backgroundColor: Colors.background.card,
    padding: 20
  },
  buttonContainer: {
    marginBottom: 14,
    marginTop: 8,
    gap: 12
  }
});

export default function ScanScreen() {
    const [input, setInput] = useState('');
  useEffect(()=>{
    scan?.setBackImageUri(null);
    scan?.setBrandName(null);
    scan?.setFeatureTags(null);
    scan?.setFrontImageUri(null);
    scan?.setIngredients(null);
    scan?.setProductName('');
    scan?.setSkincareFunction(null);
    scan?.setopenedDate('');
    scan?.setusingTime('');
    scan?.setRegistrationResult(null);
  }, []);

  const scan = useContext(ScanContext);
  const handleSubmit = () => {
    scan?.setProductName(input);
    router.push('/scan/recognision');
  };
  const cameraRef = useRef<CameraCaptureRef>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTakePhoto = async () => {
    /*
      if (!cameraRef.current?.isReady()) {
        console.warn("[DEBUG] 카메라가 아직 준비되지 않음");
        return;
        }
        */
    const uri = await cameraRef.current?.takePhoto();

    // [DEBUG 1] photo.uri 출력
    // console.log("[DEBUG 1] photo.uri:", uri);

    if (!uri) {
      return;
    }

    setPhotoUri(uri);
    scan?.setFrontImageUri(uri);

    // setIsProcessing(true);

    scan?.setBrandName('라로슈포제');
    scan?.setProductName('시카플라스트 밤 B5+');
    scan?.setIngredients(
      ['판테놀', '마데카소사이드', '트라이비오마']
    );
    scan?.setFeatureTags(['고보습','시카 밤']);
    router.push('/scan/recognision');

    /*
    try {
      // [DEBUG 2] extractOcrText 호출 직전 uri 출력
      console.log("[DEBUG 2] extractOcrText 호출 전 uri:", uri);

      const { rawText } = await extractOcrText(uri);
      const structured = await structureOcrText(rawText);

      scan?.setBrandName(structured.brand);
      scan?.setProductName(structured.name);
      scan?.setSkincareFunction(structured.type);
      scan?.setIngredients(
        structured.keyIngredients
          ? structured.keyIngredients.split(',').map((item) => item.trim()).filter(Boolean)
          : []
      );
      scan?.setFeatureTags(structured.interactionTags ?? []);

      router.push('/scan/recognision');
    } catch (error) {
      console.error('OCR/구조화 실패:', error);
      Alert.alert(
        '인식에 실패했어요',
        '다시 촬영하시거나 아래에서 직접 입력해주세요.'
      );
    } finally {
      setIsProcessing(false);
    }
  */

  };

  return (
    <>
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{paddingVertical: 20}}>
        <HeaderNavigation title="제품 등록" />
      </View>

      <ScrollView>
        <View style={ Styles.container }>
          <View style={{ gap: 8 }}>
            <Text style={Typography.title.big}>
              제품 앞면이 보이게{'\n'}찍어주세요
            </Text>
            <Text style={[Typography.secondary.default, {color: Colors.text.secondary}]}>
              이름과 브랜드를 읽어올게요
            </Text>
          </View>
          <View style={Styles.cameraContainer}>
            <CameraCapture ref={cameraRef} />
          </View>
          <View style={Styles.card}>
            <Text style={[Typography.text.accent]}>
              글씨가 안 읽히나요?
            </Text>
            <Text style={[Typography.secondary.small, {color: Colors.text.secondary}]}>
              밝은 곳에서 다시 찍거나, 아래에서 이름을 직접 적으셔도 됩니다.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={Styles.buttonContainer}>
        <ActionButton
          text={isProcessing ? "인식하는 중..." : "촬영"}
          onPress={handleTakePhoto}
          disabled={isProcessing}
        />
        <TextInput
            placeholder={"직접 입력하기"}
            placeholderTextColor={Colors.text.default}
            value={input}
            onChangeText={setInput}
            textAlignVertical="top"
            style={[Typography.button.big,{
                textAlign: 'center' ,borderWidth: 1, borderColor: Colors.border.defaultLight, backgroundColor: Colors.background.card, borderRadius:16 , padding: 20, includeFontPadding: false
            }]}
            onSubmitEditing={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
    </>
  );
}