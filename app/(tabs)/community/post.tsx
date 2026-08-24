/**
 * 게시글 작성 화면
 */

import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import NightIcon from '@/assets/icons/night.svg';
import PathIcon from '@/assets/icons/path.svg';
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/src/contexts/UserContext";
import HeaderNavigation from "@/src/components/HeaderNavigation";
import ActionButton from "@/src/components/ActionButton";
import TagButtonList from "@/src/components/TagButtonList";
import { useFocusEffect } from "@react-navigation/native";
import { PostContext } from "@/src/contexts/PostContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingBottom: 14,
        paddingHorizontal: 16,
        flex: 1,
        gap: 16
    },
    content: {
        flex: 1,
        gap: 16,
        marginBottom: 24
    },
    information: {
        gap: 6,
        borderWidth: 1, borderStyle: 'solid', borderColor: Colors.border.defaultLight, borderRadius: 16,
        paddingVertical: 16, paddingHorizontal: 18,
        backgroundColor: Colors.sand[200]
    },
    textarea: {
        minHeight: 254,
        borderWidth: 1, borderStyle: 'solid', borderColor: Colors.border.defaultLight, borderRadius: 16,
        paddingVertical: 18, paddingHorizontal: 20,
        backgroundColor: Colors.background.card,
        includeFontPadding: false
    },
    checkbox: {
        width: 22, height: 22,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: "center", alignItems: "center",
    }
})

export default function CommunityScreen() {
    const user = useContext(UserContext);
    const postcontext = useContext(PostContext);
    useFocusEffect(() => user?.setIsWriting(true))
    
    const symptomsList = ['가려움', '건조·당김', '따가움'];
    const situationsList = ['잠 못 잤을 때', '스트레스'];

    const [selectedSymptoms, setselectedSymptoms] = useState<Array<string>>([]);
    const [selectedSituations, setselectedSituations] = useState<Array<string>>([]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    useEffect(()=>{
        postcontext?.setContent('');
        postcontext?.setIsChecked(false);
        postcontext?.setSituationTags(null);
        postcontext?.setSymptomTags(null);
    }, [])

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <View style={ Styles.container }>
            <HeaderNavigation title="경험 남기기" />
            <ScrollView>
            <View style={ Styles.content }>
                <View style={Styles.information}>
                    <Text
                        style={Typography.label.default}
                    >이런 내용은 쓸 수 없어요</Text>
                    <Text
                        style={[Typography.secondary.small, {color: Colors.text.secondary}]}
                    >제품명과 브랜드명 (성분은 괜찮아요){'\n'}병원명과 시술 가격{'\n'}진단명 단정, 치료법 권유</Text>
                </View>
                <View style={{gap:10}}>
                    <Text
                        style={[Typography.label.default, {color: Colors.text.secondary}]}
                    >증상 태그 · 하나는 꼭 골라주세요</Text>
                    <TagButtonList
                        tagList={symptomsList}
                        selection={selectedSymptoms}
                        setSelection={setselectedSymptoms}
                    />
                </View>
                <View style={{gap:10}}>
                    <Text
                        style={[Typography.label.default, {color: Colors.text.secondary}]}
                    >상황 태그 · 선택</Text>
                    <TagButtonList
                        tagList={situationsList}
                        selection={selectedSituations}
                        setSelection={setselectedSituations}
                    />
                </View>
                <View style={{gap: 12}}>
                    <TextInput
                        placeholder={"제목을 적어주세요."}
                        placeholderTextColor={Colors.text.muted}
                        value={title}
                        onChangeText={setTitle}
                        textAlignVertical="top"
                        style={[Typography.text.default,{
                            borderWidth: 1, borderStyle: 'solid', borderColor: Colors.border.defaultLight, borderRadius: 16,
                            paddingVertical: 18, paddingHorizontal: 20,
                            backgroundColor: Colors.background.card,
                            includeFontPadding: false
                        }]}
                    />
                    <TextInput
                        placeholder="어떤 일이 있었는지 편하게 적어주세요"
                        placeholderTextColor={Colors.text.muted}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                        style={[Styles.textarea, Typography.text.default]}
                    />
                </View>
                <View style={{gap:12}}>
                    <Pressable
                        style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}
                        onPress={() => setIsChecked(prev => !prev)}
                    >
                        <View
                            style={[
                                Styles.checkbox,
                                {
                                    borderColor: isChecked ? Colors.accent.dark : Colors.border.defaultLight,
                                    backgroundColor: isChecked ? Colors.accent.default : Colors.background.card,
                                }
                            ]}
                        >
                            {isChecked && <Text style={{ color: "white" }}>V</Text>}
                        </View>
                        <Text
                            style={Typography.text.small}
                        >폐경 연차 공개</Text>
                    </Pressable>
                    
                    <Text
                        style={[Typography.secondary.small, {color:Colors.text.muted}]}
                    >익명으로 올라갑니다. 얼굴 사진과 월경 상태는 포함되지 않습니다.</Text>
                </View>
            </View>
            </ScrollView>
            <ActionButton
                text="작성 완료"
                route={'/(tabs)/community'}
                disabled={!selectedSymptoms.length || !title || !content}
                onPress={async ()=>{
                    postcontext?.setSymptomTags(selectedSymptoms);
                    postcontext?.setSituationTags(selectedSituations);
                    postcontext?.setContent(content);
                    postcontext?.setIsChecked(isChecked);
                    if (postcontext?.posts) {
                        const json = await AsyncStorage.getItem("userData") ?? '{}'
                        const userData = JSON.parse(json);
                        const userInfo = userData['period'] ?? '익명';
                        let key = postcontext.posts.length;
                        console.log(key)
                        postcontext.setPosts([...postcontext.posts, {
                            id: key,
                            title: title,
                            tags: [...selectedSymptoms, ...selectedSituations],
                            info: [isChecked ? '비공개' : userInfo, '방금 전'],
                            like: 0,
                            content: content
                        }])
                    }
                }}
            />
        </View>
        </KeyboardAvoidingView>
    )
};