import { create } from "zustand";
import { persist } from "zustand/middleware";
import createSelectors from "./selectors";

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
	pinnedMasjidIds: ["4NPLKr0ous15BQ1Jb3vP9krgVs0BODH7"],
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
						(mid) => mid !== masjidId,
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
		},
	),
);

const usePinMasjidStore = createSelectors(usePinMasjidStoreBase);

export default usePinMasjidStore;
