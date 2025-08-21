import type { Bindings } from "@api/index";
interface TranslationResult {
    english: string;
    hindi: string;
    urdu: string;
}
interface MasjidTranslationResult {
    name: {
        english: string;
        hindi: string;
        urdu: string;
    };
    address: {
        english: string;
        hindi: string;
        urdu: string;
    };
}
export declare function getTranslations(text: string, env: Bindings): Promise<TranslationResult>;
export declare function getMasjidTranslations(name: string, address: string, env: Bindings): Promise<MasjidTranslationResult>;
export {};
