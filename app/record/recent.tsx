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
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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
            <View style={{paddingVertical: 20}}>
                <HeaderNavigation title="증상 기록" key={0} />
            </View>
            <ScrollView>
            <View style={ Styles.container }>
                <View style={{ gap: 8 }}>
                    <Text
                        style={ [Typography.label.default, { color: Colors.text.accent }] }
                    >3 / 4</Text>
                    <Text
                        style={ Typography.title.default }
                    >최근 새로 쓴 제품이 있나요?</Text>
                </View>
                <View style={{ gap: 12 }}>
                    <TextInput
                        placeholder={"최근 새로 쓴 제품이 있다면 적어주세요."}
                        placeholderTextColor={Colors.text.muted}
                        value={input}
                        onChangeText={setInput}
                        textAlignVertical="top"
                        style={[Typography.text.small,{borderWidth: 1, borderColor: Colors.border.defaultLight, backgroundColor: Colors.background.card, borderRadius:10 , padding: 20, includeFontPadding: false}]}
                    />
                </View>
                <View style={{
                    gap: 8,
                    backgroundColor: Colors.background.subtle,
                    borderWidth: 1, borderStyle: 'solid', borderColor: Colors.border.defaultLight, borderRadius: 16,
                    padding: 20
                }}>
                    <Text
                        style={[Typography.label.default, { color: Colors.text.secondary }]}
                    >다음 질문</Text>
                    <Text
                        style={[Typography.secondary.small, { color: Colors.text.secondary }]}
                    >그 밖에 알려주실게 있나요?</Text>
                </View>
            </View>
                
            </ScrollView>
            <View style={Styles.buttonContainer}>
                <ActionButton
                    text="입력 완료"
                    route={'/record/note'}
                    onPress={()=>{
                        user?.recordSymptom.setRecentProduct(input);
                        record?.setRecentProduct(input);
                    }}
                />
            </View>
        </>
    )
}