import { createContext, useState } from "react";

type post = {
    id: number,
    title: string,
    tags: string[],
    info: string[]
    like: number,
    content: string
}

type PostContextType = {
    symptomTags: string[] | null;
    setSymptomTags: (symptomTags: string[] | null) => void;
    situationTags: string[] | null;
    setSituationTags: (situationTags: string[] | null) => void;
    content: string
    setContent: (content: string) => void
    isChecked: boolean
    setIsChecked: (isChecked: boolean) => void
    posts: post[]
    setPosts: (posts: post[]) => void
};

export const PostContext = createContext<PostContextType | null>(null);

export function PostProvider({ children }: { children: React.ReactNode }) {
    const [symptomTags, setSymptomTags] = useState<string[] | null>(null);
    const [situationTags, setSituationTags] = useState<string[] | null>(null);
    const [content, setContent] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [posts, setPosts] = useState<post[]>([
        {
            id: 0,
            title: '밤에 못 자면 다음날 꼭 가려워요',
            tags: ['가려움', '잠 못 잤을 때'],
            info: ['폐경 2년차', '3일 전'],
            like: 14,
            content: `작년부터 유난히 밤에 잠을 설치는데, 그런 날 아침이면 볼이랑 목 쪽이 따갑고 가려워요. 처음엔 화장품 탓인 줄 알고 몇 번 바꿔봤는데 소용이 없더라고요.

요즘은 잠을 잘 잔 날과 아닌 날을 적어두고 있어요. 확실히 차이가 보입니다.`
        },
        {
            id: 1,
            title: '세라마이드 크림으로 버티는 중',
            tags: ['가려움'],
            info: ['이행기'],
            like: 9,
            content: `안 그랬었는데 요즘 들어 피부가 가려워요.
세라마이드 크림 바르니까 좀 괜찮아지는 기분... 다른 분들은 어떻게 하시나요?`
        },
        {
            id: 2,
            title: '환절기마다 반복돼서 기록 시작했어요',
            tags: ['가려움', '계절·날씨'],
            info: ['폐경 4년차'],
            like: 6,
            content: '피부가 약해져서 그런지 꼭 이맘때 환절기마다 피부가 예민하고 가려워요.'
        }
    ]);

    return (
        <PostContext.Provider
            value={{
                symptomTags, setSymptomTags,
                situationTags, setSituationTags,
                content, setContent,
                isChecked, setIsChecked,
                posts, setPosts
            }}
        >
            {children}
        </PostContext.Provider>
    );
}