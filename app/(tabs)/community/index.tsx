/**
 * 커뮤니티 화면
 */

import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/src/contexts/UserContext";
import TagButtonList from "@/src/components/TagButtonList";
import { useFocusEffect } from "@react-navigation/native";
import Tag from "@/src/components/Tag";
import SecondaryActionButton from "@/src/components/SecondaryActionButton";
import { PostContext } from "@/src/contexts/PostContext";

const Styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingHorizontal: 16,
        flex: 1,
        gap: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center'
    },
    content: {
        gap: 12,
        marginBottom: 24
    },
    postContainer: {
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: 18,
        backgroundColor: Colors.background.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border.defaultLight
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border.defaultLight,
        padding: 20
    },
    suggestionButton: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: Colors.text.default,
        backgroundColor: Colors.background.subtle
    }
})

type PostTypes = {
    id: number
    title: string
    tags: Array<string>
    info: string | string[]
    like: number
    content: string
}

type PostProp = {
    prop: PostTypes
}

function Post({ prop }: PostProp) : React.JSX.Element {
    return (
        <Pressable
            onPress={()=>{
                router.push(`/(tabs)/community/${prop.id}`);
            }}
            style={Styles.postContainer}
        >
            <Text style={Typography.text.accent}>{prop.title}</Text>
            <View style={{flexDirection: 'row', gap: 6}}>
                {prop.tags && prop.tags.map((tag, index) => (
                    <Tag
                        key={index}
                        color={Colors.border.defaultLight} textColor={Colors.text.secondary}
                        text={tag}
                        backgroundColor={Colors.background.card}
                    />
                ))}
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[Typography.secondary.small, {color: Colors.text.muted}]}>{typeof prop.info == 'string' ? prop.info : prop.info[0]}</Text>
                <Text style={[Typography.secondary.small, {color: Colors.text.muted}]}>저도 그래요 {prop.like}</Text>
            </View>
        </Pressable>
    )
}

type NoPostsProp = {
    getLastHistory: () => {
        removedTags: string[];
        lastArr: string[];
        postCount: number;
    } | null;

    undo: () => void;
};

function NoPosts({ getLastHistory, undo }: NoPostsProp) : React.JSX.Element {
    const lastHistory = getLastHistory();
    return (
        <View style={{gap: 16}}>
            <View style={[
                Styles.card,
                {gap: 12, backgroundColor: Colors.background.card}
            ]}>
                {
                lastHistory ?
                <>
                    <Text
                        style={Typography.text.accent}
                    >아직 이 조건에 맞는 글이 없어요</Text>

                    <Text
                        style={[Typography.secondary.default, {color: Colors.text.secondary}]}
                    >조건을 하나 풀어보시겠어요?</Text>
                    <Pressable
                        style={Styles.suggestionButton}
                        onPress={undo}
                    >
                        <Text
                            style={[Typography.label.default, {textAlign: 'center'}]}
                        >{lastHistory.lastArr.length > 0
                            ? `${lastHistory.lastArr.join(" + ")}만 보기`
                            : "전체 보기"
                        } · {lastHistory.postCount}개</Text>
                    </Pressable>
                    {lastHistory.removedTags.length > 0 &&
                        <Text
                            style={[Typography.secondary.small, {color: Colors.text.muted}]}
                        >마지막에 더한 "{lastHistory.removedTags.join(", ")}" 때문에 결과가 없어졌어요</Text>
                    }
                </>
                :
                <>
                    <Text
                        style={Typography.text.accent}
                    >아직 글이 없어요</Text>
                </>
                }
                
            </View>
            <View style={[Styles.card, {gap: 10, backgroundColor: Colors.background.subtle}]}>
                <Text
                    style={Typography.text.accent}
                >첫 글을 남겨주시겠어요?</Text>
                <Text
                    style={[Typography.secondary.small, {color: Colors.text.secondary}]}
                >비슷한 분들이 나중에 이 글을 보게 됩니다</Text>
                <SecondaryActionButton
                    text="경험 남기기"
                    onPress={() => router.push('/(tabs)/community/post')}
                />
            </View>
        </View>
    )
}

export default function CommunityScreen() {
    const user = useContext(UserContext);

    useFocusEffect(()=>{
        user?.setIsReading(false);
        user?.setIsWriting(false);
    });

    const symptomsList = ['가려움', '건조·당김', '따가움'];
    const situationsList = ['잠 못 잤을 때', '스트레스'];

    const [selectedSymptoms, setselectedSymptoms] = useState<Array<string>>([]);
    const [selectedSituations, setselectedSituations] = useState<Array<string>>([]);

    // 배열의 변경 이력
    type HistoryEntry = {
    type: "selectedSymptoms" | "selectedSituations";
        previous: string[];
        added: string[];
        removed: string[];
    };

    const getArrayDiff = (
        previous: string[],
        current: string[],
    ) => {
        const added = current.filter(
            (item) => !previous.includes(item)
        );

        const removed = previous.filter(
            (item) => !current.includes(item)
        );

        return {
            added,
            removed,
        };
    };

    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const previousSelectedSymptoms = useRef(selectedSymptoms);
    const previousSelectedSituations = useRef(selectedSituations);
    const undoingType = useRef<
        "selectedSymptoms" | "selectedSituations" | null
    >(null);

    // items가 변경될 때마다 history에 기록
    useEffect(() => {
        if (previousSelectedSymptoms.current === selectedSymptoms) {
            return;
        }

        if (undoingType.current === "selectedSymptoms") {
            previousSelectedSymptoms.current = selectedSymptoms;
            undoingType.current = null;
            return;
        }

        const diff = getArrayDiff(
            previousSelectedSymptoms.current,
            selectedSymptoms,
        );

        setHistory((prev) => [
            ...prev,
            {
                type: "selectedSymptoms",
                previous: previousSelectedSymptoms.current,
                added: diff.added,
                removed: diff.removed,
            },
        ]);

        previousSelectedSymptoms.current = selectedSymptoms;
    }, [selectedSymptoms]);

    useEffect(() => {
        if (previousSelectedSituations.current === selectedSituations) {
            return;
        }

        if (undoingType.current === "selectedSituations") {
            previousSelectedSituations.current = selectedSituations;
            undoingType.current = null;
            return;
        }

        const diff = getArrayDiff(
            previousSelectedSituations.current,
            selectedSituations,
        );

        setHistory((prev) => [
            ...prev,
            {
                type: "selectedSituations",
                previous: previousSelectedSituations.current,
                added: diff.added,
                removed: diff.removed,
            },
        ]);

        previousSelectedSituations.current = selectedSituations;
    }, [selectedSituations]);

    const getAddedTagOrder = () => {
        const result: {
            tag: string;
            type: "selectedSymptoms" | "selectedSituations";
        }[] = [];

        for (let i = history.length - 1; i >= 0; i--) {
            const item = history[i];

            // 추가된 조건이 없다면 무시
            if (item.added.length === 0) {
                continue;
            }

            for (let j = item.added.length - 1; j >= 0; j--) {
                const tag = item.added[j];

                const isSelected =
                    item.type === "selectedSymptoms"
                        ? selectedSymptoms.includes(tag)
                        : selectedSituations.includes(tag);

                if (!isSelected) {
                    continue;
                }

                // 이미 들어간 태그는 중복 제거
                if (result.some((item) => item.tag === tag)) {
                    continue;
                }

                result.push({
                    tag,
                    type: item.type,
                });
            }
        }

        return result;
    };

    const getLastHistory = () => {
        // 현재 결과가 있으면 추천하지 않음
        if (filteredPosts.length > 0) {
            return null;
        }

        const tagOrder = getAddedTagOrder();

        if (tagOrder.length === 0) {
            return null;
        }

        /*
        * 최근 추가된 조건부터 하나씩 제거해본다.
        *
        * 예:
        *
        * [스트레스, 따가움, 가려움]
        *
        * 1. 스트레스 제거
        * 2. 스트레스 + 따가움 제거
        * 3. 스트레스 + 따가움 + 가려움 제거
        */

        for (let count = 1; count <= tagOrder.length; count++) {
            const removedTags = tagOrder
                .slice(0, count)
                .map((item) => item.tag);

            const suggestedSymptoms =
                selectedSymptoms.filter(
                    (tag) => !removedTags.includes(tag)
                );

            const suggestedSituations =
                selectedSituations.filter(
                    (tag) => !removedTags.includes(tag)
                );

            const suggestedPosts = getFilteredPosts(
                suggestedSymptoms,
                suggestedSituations,
            );

            // ⭐ 결과가 생겼다면 추천
            if (suggestedPosts.length > 0) {
                return {
                    removedTags,

                    lastArr: [
                        ...suggestedSymptoms,
                        ...suggestedSituations,
                    ],

                    postCount: suggestedPosts.length,
                };
            }
        }

        return null;
    };

    const undo = () => {
        const suggestion = getLastHistory();

        if (!suggestion) {
            return;
        }

        const removedTags = suggestion.removedTags;

        undoingType.current = null;

        setselectedSymptoms((current) =>
            current.filter(
                (tag) => !removedTags.includes(tag)
            )
        );

        setselectedSituations((current) =>
            current.filter(
                (tag) => !removedTags.includes(tag)
            )
        );

        // 해당 조건을 추가했던 history도 제거
        setHistory((prev) =>
            prev.filter((item) => {
                return !item.added.some((tag) =>
                    removedTags.includes(tag)
                );
            })
        );
    };

    const postcontext = useContext(PostContext);

    const posts : Array<PostTypes> = postcontext?.posts ?? [
        {
            id: 0,
            title: '밤에 못 자면 다음날 꼭 가려워요',
            tags: ['가려움', '잠 못 잤을 때'],
            info: '폐경 2년차',
            like: 14,
            content: ''
        },
        {
            id: 1,
            title: '세라마이드 크림으로 버티는 중',
            tags: ['가려움'],
            info: '이행기',
            like: 9,
            content: ''
        },
        {
            id: 2,
            title: '환절기마다 반복돼서 기록 시작했어요',
            tags: ['가려움', '계절·날씨'],
            info: '폐경 4년차',
            like: 6,
            content: ''
        }
    ]

    const selectedTags = [
        ...selectedSymptoms,
        ...selectedSituations,
    ];

    const getFilteredPosts = (
        symptoms: string[],
        situations: string[],
    ) => {
        const selectedTags = [
            ...symptoms,
            ...situations,
        ];

        return posts.filter((post) => {
            if (selectedTags.length === 0) {
                return true;
            }

            return selectedTags.every((tag) =>
                post.tags?.includes(tag)
            );
        });
    };

    const filteredPosts = getFilteredPosts(
        selectedSymptoms,
        selectedSituations,
    );

    return (
            <View style={ Styles.container }>
                <View style={Styles.header}>
                    <Text
                        style={ Typography.title.default }
                    >이야기</Text>
                    <Pressable onPress={()=>router.push('/community/post')}>
                        <Text
                            style={[Typography.label.default, {color:Colors.text.accent}]}
                        >글쓰기</Text>
                    </Pressable>
                </View>
                <TagButtonList
                    tagList={symptomsList}
                    selection={selectedSymptoms}
                    setSelection={setselectedSymptoms}
                />
                <TagButtonList
                    tagList={situationsList}
                    selection={selectedSituations}
                    setSelection={setselectedSituations}
                />
                <Text
                    style={[
                        Typography.secondary.small,
                        {color: Colors.text.secondary}
                    ]}
                >{[
                    [...selectedSymptoms, ...selectedSituations].join(' + ') || '전체',
                    filteredPosts.length + '개'].join(' · ')}</Text>
                <ScrollView>
                <View style={ Styles.content }>
                    {
                    filteredPosts.length > 0 ?
                    <>
                        {filteredPosts.map((post, index) => (
                            <Post prop={post} key={index} />
                        ))}
                    </>
                    :
                        <NoPosts getLastHistory={getLastHistory} undo={undo} />
                    }
                </View>
                </ScrollView>
            </View>
    )
};