/**
 * 최근 쓴 제품 문항 화면
 */
import ActionButton from "@/src/components/ActionButton";
import HeaderNavigation from "@/src/components/HeaderNavigation";
import SmallOptionButton from "@/src/components/SmallOptionButton";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { RecordSymptomContext } from "@/src/contexts/RecordContext";
import { UserContext } from "@/src/contexts/UserContext";
import { useContext, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        marginBottom: 16
    },
    buttonContainer: {
        marginBottom: 14, marginTop: 8
    }
})

export default function RecordScreen() {
    const [input, setInput] = useState('');
    const user = useContext(UserContext);
    const record = useContext(RecordSymptomContext);

    return (
        <>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={{paddingVertical: 20}}>
                <HeaderNavigation title="증상 기록" key={0} />
            </View>
            <ScrollView>
            <View style={ Styles.container }>
                <View style={{ gap: 8 }}>
                    <Text
                        style={ [Typography.label.default, { color: Colors.text.accent }] }
                    >4 / 4</Text>
                    <Text
                        style={ Typography.title.default }
                    >그 밖에 알려주실게 있나요?</Text>
                </View>
                <View style={{ gap: 12 }}>
                    <TextInput
                        placeholder={"생각나는 내용을 자유롭게 적어주세요."}
                        placeholderTextColor={Colors.text.muted}
                        value={input}
                        onChangeText={setInput}
                        multiline
                        textAlignVertical="top"
                        style={[Typography.text.small,{borderWidth: 1, borderColor: Colors.border.defaultLight, backgroundColor: Colors.background.card, borderRadius:10 , padding: 20, includeFontPadding: false, minHeight: 254}]}
                    />
                </View>
            </View>
                
            </ScrollView>
            <View style={Styles.buttonContainer}>
                <ActionButton
                    text="입력 완료"
                    route={'/record/camera'}
                    onPress={()=>{
                        record?.setNote(input);
                    }}
                />
            </View>
        </KeyboardAvoidingView>
        </>
    )
}