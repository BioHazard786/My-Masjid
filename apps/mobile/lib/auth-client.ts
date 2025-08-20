import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL || "https://my-masjid-api.biohazard786.workers.dev"}/auth`,
  plugins: [
    expoClient({
      scheme: "mymasjid",
      storagePrefix: "mymasjid",
      storage: SecureStore,
    }),
  ],
});
