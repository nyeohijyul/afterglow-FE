/**
 * 홈 화면
 */

import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import NightIcon from '@/assets/icons/night.svg';
import PathIcon from '@/assets/icons/path.svg';
import { router } from "expo-router";
import { useContext } from "react";
import { UserContext } from "@/src/contexts/UserContext";
import { RecordSymptomContext } from "@/src/contexts/RecordContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const user = {
    profileImage: false
}

const profileImage = user.profileImage
  ? { uri: user.profileImage }
  : require("../../assets/images/profile.png");

const logo = require('@/assets/images/logo.png');

const Styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingHorizontal: 16,
        flex: 1,
        gap: 12
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    content: {
        gap: 12,
        marginBottom: 24
    },
    card: {
        borderRadius: 18,
        padding: 20
    }
})

const SleepStyles = StyleSheet.create({
    container: {
        gap: 2,
        backgroundColor: Colors.sand[200]
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    time: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        gap: 6
    }
})

const RoutineStyles = StyleSheet.create({
    container: {
        gap: 8
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selected: {
        borderRadius: 60,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: Colors.accent.light
    },
    selectedText: {
        ...Typography.text.accent,
        color: '#42362F'
    },
    list: {
        height: 48,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
})

function RoutineList({ num, text }: {
    num: number;
    text: string;
}) : React.JSX.Element {
    return (
        <View style={ RoutineStyles.list }>
            <View style={{ backgroundColor: Colors.sand[400], borderRadius: 200, width: 28, height: 28, justifyContent: "center", alignItems: "center" }}>
                <Text style={[ Typography.label.default, { color: Colors.text.inverted } ]}>{ num }</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={ [Typography.text.accent, { color: Colors.text.accent}] }>{ text }</Text>
            </View>
            <Text style={ [Typography.text.accent, { color: Colors.text.accent}] }>✓</Text>
        </View>
    )
}

export default function HomeScreen() {
    const user = useContext(UserContext);
    const record = useContext(RecordSymptomContext);
    const cancelOnboarding = async () => await AsyncStorage.setItem("onboardingCompleted", "false");

    return (
            <View style={ Styles.container }>
                <View style={ Styles.header }>
                    <Image source={logo} style={{width: 173, height: 27}} />
                    <Image
                        source={profileImage}
                        width={30}
                        height={30}
                    />
                </View>
                <ScrollView>
                <View style={ Styles.content }>
                    {/** 수면 시간 */}
                    <View style={ [Styles.card, SleepStyles.container, { backgroundColor: Colors.sand[200] }] }>
                        <View style={ SleepStyles.header }>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <NightIcon width={15.83} height={15} />
                                </View>
                                <Text style={ Typography.text.accent }>어젯밤 수면</Text>
                            </View>
                            <View style={{ borderRadius: 200, paddingVertical: 2, paddingHorizontal: 8, backgroundColor: Colors.background.card, justifyContent: 'center', alignItems: 'center' }}>
                                <Pressable onPress={()=>{cancelOnboarding(); router.push('/onboarding')}}>
                                <Text style={ Typography.secondary.small }>워치 연동</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={ SleepStyles.time }>
                            <Text style={ Typography.figure.big }>{5}</Text>
                            <Text style={ Typography.title.small }>시간</Text>
                            <Text style={ Typography.figure.big }>{20}</Text>
                            <Text style={ Typography.title.small }>분</Text>
                        </View>
                        <Text style={ [Typography.text.accent, { color: Colors.text.secondary }] }>평소보다 1시간 20분 적어요</Text>
                        <Text style={ [Typography.text.small, { color: Colors.text.secondary }] }>잠이 부족했던 다음 날{'\n'}건조함을 자주 기록하셨어요</Text>
                    </View>
                    {/** 피부 원인 확인하기 */}
                    <Pressable onPress={()=>{
                        user?.recordSymptom.setIsCompleted(false);
                        record?.setIsCompleted(false);
                        router.push('/record');
                    }}>
                    <View style={ [Styles.card, {backgroundColor: Colors.accent.default, position: 'relative'}] }>
                        <Text style={ [Typography.figure.big, { color: '#42362F' }] }>피부가{'\n'}불편해요</Text>
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingTop: 8 }}>
                            <Text style={ [Typography.text.accent, { color: Colors.text.accent }] }>ai로 원인 알아보기</Text>
                            <Text style={ [Typography.title.small, { color: Colors.text.accent }] }>→</Text>
                        </View>
                        <Image source={require('../../assets/images/button-bg.png')} style={{ position: 'absolute', top: 0, bottom: 0, right: 0}}/>
                    </View>
                    </Pressable>
                    {/** 루틴 */}
                    <View style={ [Styles.card, RoutineStyles.container, { backgroundColor: Colors.background.card }] }>
                        <View style={ RoutineStyles.header }>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}>
                                    <PathIcon width={18} height={20} />
                                </View>
                                <Text style={ Typography.button.default }>오늘의 루틴</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Pressable>
                                <View style={ true && RoutineStyles.selected }>
                                    <Text style={ [
                                        Typography.text.default,
                                        { color: Colors.text.secondary },
                                        true && RoutineStyles.selectedText
                                    ] }>아침 {3}</Text>
                                </View>
                                </Pressable>
                                <Pressable>
                                <View style={ false && RoutineStyles.selected }>
                                    <Text style={ [
                                        Typography.text.default,
                                        { color: Colors.text.secondary },
                                        false && RoutineStyles.selectedText
                                    ] }>저녁 {4}</Text>
                                </View>
                                </Pressable>
                            </View>
                        </View>
                        <>
                        {['티트리 시카 스킨', '토리든 다이브인 세럼', '에스네이처 스쿠알란'].map((value, index) => (
                            <RoutineList key={index} num={index + 1} text={value} />
                        ))}
                        </>
                    </View>
                </View>
                </ScrollView>
            </View>
    )
};