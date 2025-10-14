import { client } from "@mobile/lib/api-client";
import type {
	createMasjidSchema,
	fullMasjidSchema,
	pinMasjidSchema,
	prayerTimesSchema,
} from "@packages/validators";
import * as Crypto from "expo-crypto";
import i18next from "i18next";
import { MMKV } from "react-native-mmkv";
import type { z } from "zod";
import { authClient } from "@/apps/mobile/lib/auth-client";

// Infer the TypeScript types from the Zod schemas
export type Masjid = z.infer<typeof fullMasjidSchema>;
export type CreateMasjidData = z.infer<typeof createMasjidSchema>;
export type PrayerTimesData = z.infer<typeof prayerTimesSchema>;
export type PinMasjidData = z.infer<typeof pinMasjidSchema>;

export const searchMasjids = async (query: string) => {
	if (!query) {
		// Return a success state with empty data to prevent API calls
		return { success: true, data: [] as Masjid[] };
	}

	const response = await client.user.masjids.search.$get({
		query: { q: query },
	});

	if (!response.ok) {
		// This handles network errors, not application errors
		throw new Error("Network response was not ok");
	}
	return response.json();
};

export const getMasjidById = async (masjidId: string) => {
	const response = await client.user.masjid[":id"].$get({
		param: { id: masjidId },
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return await response.json();
};

export const createMasjid = async (masjidData: {
	name: string;
	address: string;
}) => {
	const cookies = authClient.getCookie();
	const headers = {
		Cookie: cookies,
	};

	const response = await client.masjid.create.$post(
		{
			json: masjidData,
		},
		{
			headers: headers,
		},
	);

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return await response.json();
};

export const updatePrayerTimes = async (prayerTimes: PrayerTimesData) => {
	const cookies = authClient.getCookie();
	const headers = {
		Cookie: cookies,
	};
	const response = await client.masjid["prayer-times"].$put(
		{
			json: prayerTimes,
		},
		{
			headers: headers,
		},
	);

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return await response.json();
};

export const getMasjidProfile = async () => {
	const cookies = authClient.getCookie();
	const headers = {
		Cookie: cookies,
	};
	const response = await client.masjid.$get({
		headers: headers,
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return await response.json();
};

export const pinMasjid = async (masjidId: string, pushToken: string) => {
	const deviceId = getDeviceId();
	const preferredLanguage = i18next.language || "en";

	const pinData: PinMasjidData = {
		deviceId,
		masjidId,
		pushToken,
		preferredLanguage,
	};

	const response = await client.user.masjids.pin.$post({
		json: pinData,
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return await response.json();
};

export const unpinMasjid = async (masjidId: string) => {
	const deviceId = getDeviceId();

	const response = await client.user.masjids.unpin.$post({
		json: { masjidId, deviceId },
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return await response.json();
};

export const changePreferredLanguage = async (preferredLanguage: string) => {
	const deviceId = getDeviceId();

	await client.user.changePreferredLanguage.$post({
		json: { deviceId, preferredLanguage },
	});

	return;
};

function getDeviceId(): string {
	const storage = new MMKV({ id: "device-id" });
	const storedDeviceId = storage.getString("DEVICE_ID");
	if (storedDeviceId) {
		return storedDeviceId;
	}
	const deviceId = Crypto.randomUUID();
	storage.set("DEVICE_ID", deviceId);
	return deviceId;
}
