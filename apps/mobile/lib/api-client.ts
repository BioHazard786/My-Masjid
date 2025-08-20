import type { AppType } from "@api/index";
import { hc } from "hono/client";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://my-masjid-api.biohazard786.workers.dev";

export const client = hc<AppType>(API_BASE_URL);
