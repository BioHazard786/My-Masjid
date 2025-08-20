import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import createSelectors from "./selectors";

const storage = new MMKV({ id: "pin-masjid-ids" });

const zustandStorage: StateStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

type State = {
  pinnedMasjidIds: string[];
};

type Action = {
  pinMasjid: (masjidId: string) => void;
  unpinMasjid: (masjidId: string) => void;
  isPinnedMasjid: (masjidId: string) => boolean;
  getPinnedMasjidIds: () => string[];
};

const InitialState: State = {
  pinnedMasjidIds: [],
};

const usePinMasjidStoreBase = create<State & Action>()(
  persist(
    (set, get) => ({
      ...InitialState,
      pinMasjid: (masjidId) => {
        set((state) => ({
          pinnedMasjidIds: [
            ...state.pinnedMasjidIds.filter((mid) => mid !== masjidId),
            masjidId,
          ],
        }));
      },
      unpinMasjid: (masjidId) => {
        set((state) => ({
          pinnedMasjidIds: state.pinnedMasjidIds.filter(
            (mid) => mid !== masjidId
          ),
        }));
      },
      isPinnedMasjid: (masjidId) => {
        const state = get();
        return state.pinnedMasjidIds.includes(masjidId);
      },
      getPinnedMasjidIds: () => {
        const state = get();
        return state.pinnedMasjidIds;
      },
    }),
    {
      name: "PIN_MASJID_IDS",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

const usePinMasjidStore = createSelectors(usePinMasjidStoreBase);

export default usePinMasjidStore;
