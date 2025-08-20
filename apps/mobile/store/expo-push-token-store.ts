import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import createSelectors from "./selectors";

const storage = new MMKV({ id: "expo-push-token" });

const zustandStorage: StateStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

type State = {
  expoPushToken: string | null;
};

type Action = {
  setExpoPushToken: (token: string | null) => void;
  clearExpoPushToken: () => void;
};

const InitialState: State = {
  expoPushToken: null,
};

const useExpoPushTokenStoreBase = create<State & Action>()(
  persist(
    (set) => ({
      ...InitialState,
      setExpoPushToken: (token) => {
        set({ expoPushToken: token });
      },
      clearExpoPushToken: () => {
        set({ expoPushToken: null });
      },
    }),
    {
      name: "EXPO_PUSH_TOKEN",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

const useExpoPushTokenStore = createSelectors(useExpoPushTokenStoreBase);

export default useExpoPushTokenStore;
