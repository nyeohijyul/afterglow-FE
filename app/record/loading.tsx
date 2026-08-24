import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { UserContext } from "@/src/contexts/UserContext";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import LoadingIcon from '@/assets/icons/loading.svg';
import { submitFullRecord, symptomLabelToEnum, onsetPeriodLabelToEnum } from "@/src/api/episode";
import { RecordSymptomContext } from "@/src/contexts/RecordContext";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    logContainer: {
        justifyContent: 'center', alignItems: 'center',
        paddingVertical: 100
    },
    logWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderStyle: 'solid', borderColor: Colors.border.defaultLight,
        borderRadius: 16,
        paddingVertical: 18, paddingHorizontal: 20,
        backgroundColor: Colors.background.card
    },
    log: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 10, height: 10,
        borderRadius: 5,
        backgroundColor: Colors.accent.default
    },
    caption: {
        alignItems: 'center',
        marginTop: 20
    }
})

function Log({ text }: {
    text: string,
}) : React.JSX.Element {
    return (
        <View
            style={Styles.logWrapper}
        >
            <View style={Styles.log}>
                <View style={Styles.dot}></View>
                <Text
                    style={ Typography.text.default }
                >{ text }</Text>
            </View>
            <Text
                style={ [Typography.secondary.small, { color: Colors.text.muted }] }
            >읽는 중...</Text>
        </View>
    )
}

export default function loadingScreen() {
    const user = useContext(UserContext);
    const record = useContext(RecordSymptomContext);

    /*
    useEffect(() => {
        if (!record?.isCompleted || !user) return;

        let isCancelled = false;

        const submitToServer = async () => {
            const symptom = symptomLabelToEnum[user.recordSymptom.state];
            const onsetPeriod = onsetPeriodLabelToEnum[user.recordSymptom.duration];

            // state/duration 값이 매핑표에 없으면 요청을 보내지 않음
            if (!symptom || !onsetPeriod) {
                console.log('❌ 매핑 실패 - state:', user.recordSymptom.state, 'duration:', user.recordSymptom.duration);
                return;
            }

            try {
                // POST /api/episodes → POST /api/episodes/{episodeId}/intake 순서로 호출, episodeId 반환
                const episodeId = await submitFullRecord({
                    // TODO: 원형 격자 좌표값으로 교체
                    angle: 0,
                    radius: 0.5,
                    severity: 'MODERATE',

                    primarySymptom: symptom,
                    onsetPeriod: onsetPeriod,

                    // TODO: part.tsx 옵션 완성 후 매핑 함수로 교체
                    bodyParts: ['WHOLE_FACE'],

                    recentNewProductName: user.recordSymptom.recentProduct || undefined,
                });

                // episodeId를 Context에 저장 (체크인 등 이후 화면에서 사용)
                user.recordSymptom.setEpisodeId(episodeId);

                // 서버 저장 성공 후에만 결과 화면으로 이동
                if (!isCancelled) {
                    router.replace("/result");
                }
            } catch (error) {
                console.log('❌ episode 저장 실패:', error);
                // 실패 시 UX 처리(에러 화면/재시도)는 정책 확정 후 별도 작업
            }
        };

        submitToServer();

        return () => {
            isCancelled = true;
        };
    }, [record?.isCompleted, user]);
    */
    useEffect(() => {
        if (!user?.recordSymptom.isCompleted) return;

        const timer = setTimeout(() => {
            router.replace("/result");
        }, 3000);

        return () => clearTimeout(timer);
    }, [user?.recordSymptom.isCompleted]);
    
    return (
        <View style={Styles.container}>
            <View style={{ gap: 8 }}>
                <Text
                    style={ Typography.title.default }
                >기록을 살펴보고 있어요</Text>
                <Text
                    style={ Typography.secondary.default }
                >5초 안에 끝납니다.</Text>
            </View>
            <View style={Styles.logContainer}>
                <LoadingIcon width={96} height={98.42}/>
            </View>
            <View style={{ gap: 12 }}>
                {['지난 7일 수면 기록', '화장대 제품 12개', '오늘 답해주신 내용'].map((item, index) => (
                    <Log
                        key={ index }
                        text={ item }
                    />
                ))}
            </View>
            <View style={Styles.caption}>
                <Text
                    style={ [Typography.secondary.small, { color: Colors.text.muted }] }
                >사진은 휴대폰 안에만 저장됩니다</Text>
            </View>
        </View>
    )
}