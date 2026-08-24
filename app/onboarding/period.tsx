/**
 * 월경 문항 화면
 */

import ActionButton from "@/src/components/ActionButton";
import SkipButton from "@/src/components/SkipButton";
import SmallOptionButton from "@/src/components/SmallOptionButton";
import { Typography } from "@/src/constants/typography";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { UserContext } from "@/src/contexts/UserContext";
import { UserDataContext } from "@/src/contexts/UserDataContext";
import { submitOnboarding, ageRangeLabelToEnum, menstrualStatusLabelToEnum } from "@/src/api/onboarding";

const Styles = StyleSheet.create({
    header: {
        paddingVertical: 20,
    },
    body: {
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        gap: 10.72
    }
})

const completeOnboarding = async () => await AsyncStorage.setItem("onboardingCompleted", "true");

export default function Onboarding() {
    const [period, setPeriod] = useState('');
    const options = ['대체로 규칙적이었다', '주기가 들쭉날쭉해졌다', '두 달 이상 건너뛴 적 있다', '마지막 월경 후 1년이 지났다', '수술이나 치료로 없다', '답하고 싶지 않다'];
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);

    const handleNext = async () => {
        // 1. Context 업데이트
        user?.data.setPeriod(period);
        userData?.setPeriod(period);
        const userInfo = period == options[1] || period == options[2] ? '이행기' : period == options[3] ? '폐경 1년차' : '이용자'
        const dataToSave = {
            age: userData?.age,
            period: userInfo, // 객체든 문자열이든 알아서 안전하게 JSON 문자열로 변환해 줍니다.
        };
        await AsyncStorage.setItem("userData", JSON.stringify(dataToSave))

        // 2. 한글 -> Enum 매핑
        const ageRange = user?.data.age ? ageRangeLabelToEnum[user.data.age] : undefined;
        const menstrualStatus = menstrualStatusLabelToEnum[period];

        // 3. 매핑 예외 처리
        if (!ageRange || !menstrualStatus) {
            console.error("❌ 온보딩 데이터 매핑 실패 - age:", user?.data.age, "period:", period);
            return;
        }

        // 4. API 전송 및 라우팅
        try {
            await submitOnboarding({ ageRange, menstrualStatus });
            await completeOnboarding();
            router.replace('/(tabs)');
        } catch (error) {
            console.error("❌ 온보딩 저장 실패:", error);
        }
    };

    return (
        <>
            <View style={ Styles.header }>
                <Text style={ Typography.title.default }>최근 1년간 월경은{'\n'}어떠셨나요?</Text>
            </View>
            <View style={ Styles.body }>
                <ScrollView>
                <View style={ Styles.content }>
                    {options.map((option, index) => (
                        <SmallOptionButton text={ option } onPress={ () => setPeriod(option) } isSelected={ period == option } key={ index } />
                    ))}
                </View>
                </ScrollView>
                <View style={{ paddingTop: 8 }}>
                    <View>
                        <ActionButton text="다음으로" onPress={handleNext} disabled={!period} />
                    </View>
                    <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 12}}>
                        <SkipButton text="건너뛰기" route={'/(tabs)'} onPress={ completeOnboarding } />
                    </View>
                </View>
            </View>
        </>
    )
}