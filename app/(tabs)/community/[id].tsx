/**
 * 게시글 화면
 * @param id 게시글 고유번호
 */

import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/src/contexts/UserContext";
import HeaderNavigation from "@/src/components/HeaderNavigation";
import { useFocusEffect } from "@react-navigation/native";
import Tag from "@/src/components/Tag";
import { PostContext } from "@/src/contexts/PostContext";

const Styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingHorizontal: 16,
        flex: 1,
        gap: 16
    },
    content: {
        flex: 1,
        gap: 12,
        marginBottom: 24
    },
    postContent: {
        gap: 8,
        padding: 20,
        backgroundColor: Colors.background.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border.defaultLight
    },
    button: {
        paddingVertical: 12, paddingHorizontal: 18,
        borderWidth: 1, borderStyle: 'solid', borderColor: Colors.border.defaultLight, borderRadius: 200,
        backgroundColor: Colors.background.card
    },
    line: {
        flex:1,
        height: 1,
        backgroundColor: Colors.border.defaultLight
    },
})

type PostTypes = {
    id: number
    title: string
    tags?: Array<string>
    info: Array<string>
    like: number,
    content: string
}

type PostProp = {
    post: PostTypes,
    likes: number
    setLikes: (likes: number)=>void
    reply?: comment[]
}

function Post({ post, likes, setLikes, reply }: PostProp) : React.JSX.Element {
    const [isPressed, setIsPressed] = useState(false);
    function onPress() {
        if (isPressed) {
            setIsPressed(false);
            setLikes(likes - 1);
        } else {
            setIsPressed(true);
            setLikes(likes + 1);
        }
    }
    return (
        <>
            <View style={{gap: 10}}>
                <Text
                    style={Typography.title.default}
                >{post.title}</Text>
                <View style={{flexDirection: 'row', gap: 6}}>
                    {post.tags && post.tags.map((tag, index) => (
                        <Tag
                            key={index}
                            color={Colors.border.defaultLight} textColor={Colors.text.secondary}
                            text={tag}
                            backgroundColor={Colors.background.card}
                        />
                    ))}
                </View>
                <Text
                    style={[Typography.secondary.small, {color: Colors.text.muted}]}
                >{post.info.join(' · ')}</Text>
            </View>
            <View style={Styles.postContent}>
                <Text
                    style={Typography.text.small}
                >{post.content}</Text>
            </View>
            
            <View style={{flexDirection: 'row', gap: 10}}>
                <Pressable
                    onPress={onPress}
                    style={[
                        Styles.button,
                        isPressed && {borderColor: Colors.text.default}
                    ]}
                >
                    <Text
                        style={[
                            Typography.secondary.small,
                            { color: Colors.text.muted },
                            isPressed && Typography.label.default
                        ]}
                    >저도 그래요 {likes}</Text>
                </Pressable>
            </View>
            <View style={Styles.line}></View>
            <Text
                style={[
                    Typography.label.default,
                    {color: Colors.text.secondary}
                ]}
            >댓글 {reply ? reply.length : 0}</Text>
            {reply && <CommentView key={0} comments={reply} />}
        </>
    )
}

function CommentView({comments}: {comments: comment[]}) : React.JSX.Element {
    return (
        <>
            {comments.map((comment, index)=>(
                <View key={index} style={{gap: 12}}>
                <View key={index} style={{gap: 6}}>
                    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                        {comment.name && <Text style={Typography.label.default}>{comment.name}</Text>}
                        <Text style={[Typography.secondary.small, {color: Colors.text.muted}]}>{comment.time}</Text>
                    </View>
                    <View>
                        <Text style={Typography.text.default}>{comment.reply}</Text>
                    </View>
                </View>
                {comments.length - 1 != index && <View key={index+'l'} style={Styles.line}></View>}
                </View>
            ))}
        </>
    )
}

type comment = {
    name?: string,
    time: string,
    reply: string
}

export default function CommunityScreen() {
    const {id} = useLocalSearchParams<{id:string}>()
    const postId = parseInt(id);
    const postcontext = useContext(PostContext);
    const [reply, setReply] = useState('');
    const [comments, setComments] = useState<comment[]>(postId == 0 ? [
        {
            name: '폐경 3년차',
            time: '2일 전',
            reply: '저도 잠을 설친 날 아침에 목이 제일 가려워요. 기록해두니 확실히 보이더라고요.'
        },
        {
            name: '이행기',
            time: '1일 전',
            reply: '밤에 실내 온도를 좀 낮추면 나으신가요? 저는 그게 도움이 됐어요.'
        },
        {
            name: '폐경 1년차',
            time: '1일 전',
            reply: '저는 가습기를 틀고부터 아침에 덜 당기더라고요.'
        }
    ]: [])
    const user = useContext(UserContext);
    useFocusEffect(() => user?.setIsReading(true))
    const getexamplePost = () => (postcontext?.posts[postId] ?? (postId == 0 ? {
            id: 0,
            title: '밤에 못 자면 다음날 꼭 가려워요',
            tags: ['가려움', '잠 못 잤을 때'],
            info: ['폐경 2년차', '3일 전'],
            like: 14,
            content: `작년부터 유난히 밤에 잠을 설치는데, 그런 날 아침이면 볼이랑 목 쪽이 따갑고 가려워요. 처음엔 화장품 탓인 줄 알고 몇 번 바꿔봤는데 소용이 없더라고요.

요즘은 잠을 잘 잔 날과 아닌 날을 적어두고 있어요. 확실히 차이가 보입니다.`
        } : postId == 1 ? {
            id: 1,
            title: '세라마이드 크림으로 버티는 중',
            tags: ['가려움'],
            info: ['이행기'],
            like: 9,
            content: `안 그랬었는데 요즘 들어 피부가 가려워요.
세라마이드 크림 바르니까 좀 괜찮아지는 기분... 다른 분들은 어떻게 하시나요?`
        } : {
            id: 2,
            title: '환절기마다 반복돼서 기록 시작했어요',
            tags: ['가려움', '계절·날씨'],
            info: ['폐경 4년차'],
            like: 6,
            content: '피부가 약해져서 그런지 꼭 이맘때 환절기마다 피부가 예민하고 가려워요.'
        }))
    const post = getexamplePost();
    const [likes, setLikes] = useState(post.like);
    const addComment = () => {
        const comment: comment = {
            name: '나',
            time: '방금 전',
            reply
        };
        setComments(prev => [...prev, comment])
        setReply('');
    }

    return (
        <>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <View style={ Styles.container }>
            <HeaderNavigation title="이야기" />
            <ScrollView>
            <View style={ Styles.content }>
                <Post post={post} likes={likes} setLikes={setLikes} reply={comments} />
            </View>
            </ScrollView>
        </View>
        <View style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 14,
            gap: 10,
            backgroundColor: Colors.background.card
        }}>
            <Text
                style={[Typography.secondary.small, {textAlign: 'center', color: Colors.text.muted}]}
            >개인 경험이며 의학적 조언이 아닙니다</Text>
            <View style={{gap: 10, flexDirection: 'row'}}>
                <TextInput
                    placeholder={"댓글을 남겨보세요"}
                    placeholderTextColor={Colors.text.muted}
                    value={reply}
                    onChangeText={setReply}
                    textAlignVertical="top"
                    style={[Typography.text.small,{flex: 1, borderWidth: 1, borderColor: Colors.border.defaultLight, backgroundColor: Colors.background.subtle, borderRadius:999 , paddingVertical: 13, paddingHorizontal: 18, includeFontPadding: false}]}
                />
                <Pressable
                    style={{backgroundColor: Colors.action.default, borderRadius: 999, paddingVertical: 13, paddingHorizontal: 20, alignSelf: 'center'}}
                    onPress={addComment}
                >
                    <Text style={[Typography.label.default, {color: Colors.text.inverted, textAlign: 'center'}]}>등록</Text>
                </Pressable>
            </View>
        </View>
        </KeyboardAvoidingView>
        </>
    )
};