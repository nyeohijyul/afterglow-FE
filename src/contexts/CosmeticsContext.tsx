import { createContext, useState } from "react";
import { ImageSourcePropType } from "react-native";

type cosmetic = {
    id: number,
    
    frontImageUri: ImageSourcePropType | null
    brandName: string | null
    productName: string
    skincareFunction: string | null

    ingredients: string[] | null
    featureTags: string[] | null
    
    openedDate: string,
    usingTime: string,
}

type cosmeticContextType = {
    cosmetics: cosmetic[]
    setcosmetics: (cosmetics: cosmetic[]) => void
};

export const CosmeticsContext = createContext<cosmeticContextType | null>(null);

export function CosmeticsProvider({ children }: { children: React.ReactNode }) {
    const [cosmetics, setcosmetics] = useState<cosmetic[]>([]);

    return (
        <CosmeticsContext.Provider
            value={{
                cosmetics, setcosmetics
            }}
        >
            {children}
        </CosmeticsContext.Provider>
    );
}