import { router, Stack, useFocusEffect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from "@/src/contexts/UserContext";
import * as NavigationBar from "expo-navigation-bar";
import { AppState, AppStateStatus, StyleSheet } from "react-native";
import { ScanProvider } from "@/src/contexts/ScanContext";
import { RecordSymptomProvider } from "@/src/contexts/RecordContext";
import { UserDataProvider } from "@/src/contexts/UserDataContext";
import { PostProvider } from "@/src/contexts/PostContext";
import * as SplashScreen from "expo-splash-screen";
import { createAnonymousAccount } from "@/src/api/account";
import { getAccessToken, saveAccessToken } from "@/src/api/storage";
import SplashScreenView from "@/src/components/SplashScreenVIew";
import { View } from "react-native";
import { Animated } from "react-native";
import { CosmeticsProvider } from "@/src/contexts/CosmeticsContext";


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);
  // 1. 애니메이션을 위한 투명도 변수 생성 (초기값 1: 투명도 없음)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [loaded] = useFonts({
    "KMU80 VF": require("../assets/fonts/KMU80SungkokHaeong-VF.otf"),
    "Noto Sans KR Black": require("../assets/fonts/NotoSansKR-Black.ttf"),
    "Noto Sans KR Bold": require("../assets/fonts/NotoSansKR-Bold.ttf"),
    "Noto Sans KR Regular": require("../assets/fonts/NotoSansKR-Regular.ttf"),
  });

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        NavigationBar.setVisibilityAsync("hidden");
      }
    };

    // 앱 상태 변화 리스너 등록
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const initApp = async () => {
      try {
        // 1. 익명 계정 토큰 생성 및 저장
        const existingToken = await getAccessToken();
        if (!existingToken) {
          const response = await createAnonymousAccount();
          if (response?.accessToken) {
            await saveAccessToken(response.accessToken);
          }
        }
        // 스플래시 스크린
        setTimeout(async () => {
          // 2. 0.5초(500ms) 동안 투명도를 1에서 0으로 줄이는 애니메이션 실행
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500, // 사라지는 시간 (원하는 속도로 조절 가능)
            useNativeDriver: true, // 네티브 레이어에서 실행하여 부드러움 보장
          }).start(() => {
            // 3. 애니메이션이 완전히 끝나면 커스텀 스플래시 뷰를 레이아웃에서 제거
            setIsReady(true);
          });
        }, 2000);
      } catch (error) {
        console.error("앱 초기화 중 오류 발생:", error);
      } finally {
        // 2. 온보딩 상태 확인 및 라우팅
        const completed = await AsyncStorage.getItem("onboardingCompleted");
        if (completed === "true") {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
        // 3. 초기화 또는 라우팅 완료 후 스플래시 해제
        await SplashScreen.hideAsync();
      }
    };

    initApp();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <UserDataProvider>
          <RecordSymptomProvider>
            <ScanProvider>
              <PostProvider>
                <CosmeticsProvider>
                <View style={{flex: 1}}>
                <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
                {!isReady && (<Animated.View style={[StyleSheet.absoluteFill,  { opacity: fadeAnim }]}><SplashScreenView /></Animated.View>)}
                </View>
                </CosmeticsProvider>
              </PostProvider>
            </ScanProvider>
          </RecordSymptomProvider>
        </UserDataProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}