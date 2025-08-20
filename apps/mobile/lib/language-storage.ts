import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  id: "language-storage",
});

export const languageStorage = {
  getLanguage: (): string | undefined => {
    return storage.getString("language");
  },

  setLanguage: (language: string): void => {
    storage.set("language", language);
  },

  removeLanguage: (): void => {
    storage.delete("language");
  },
};
