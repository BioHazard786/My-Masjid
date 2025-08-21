import * as schema from "@api/db/schema";
import type { User } from "better-auth";
import { DrizzleD1Database } from "drizzle-orm/d1";
export type Bindings = {
    DB: D1Database;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    GOOGLE_TRANSLATE_API_URL: string;
    GOOGLE_TRANSLATE_API_KEY: string;
    GOOGLE_TRANSLATE_API_HOST: string;
    GOOGLE_TRANSLATE_PUBLIC_API_URL: string;
};
export type Variables = {
    db: DrizzleD1Database<typeof schema>;
    user: User;
};
declare const apiRoutes: import("hono/hono-base").HonoBase<{
    Bindings: Bindings;
    Variables: Variables;
}, import("hono/types").BlankSchema | import("hono/types").MergeSchemaPath<{
    "/masjid/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                success: boolean;
                error: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                success: boolean;
                data: {
                    id: string;
                    nameEn: string;
                    nameHi: string;
                    nameUr: string;
                    addressEn: string;
                    addressHi: string;
                    addressUr: string;
                    fajr: string | null;
                    dhuhr: string | null;
                    asr: string | null;
                    maghrib: string | null;
                    isha: string | null;
                    jummah: string | null;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                success: boolean;
                error: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/masjids/search": {
        $get: {
            input: {
                query: {
                    q: string;
                };
            };
            output: {
                success: boolean;
                data: {
                    id: string;
                    nameEn: string;
                    nameHi: string;
                    nameUr: string;
                    addressEn: string;
                    addressHi: string;
                    addressUr: string;
                    fajr: string | null;
                    dhuhr: string | null;
                    asr: string | null;
                    maghrib: string | null;
                    isha: string | null;
                    jummah: string | null;
                }[];
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/masjids/pin": {
        $post: {
            input: {
                json: {
                    deviceId: string;
                    masjidId: string;
                    pushToken: string;
                    preferredLanguage: string;
                };
            };
            output: {
                success: boolean;
                data: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                json: {
                    deviceId: string;
                    masjidId: string;
                    pushToken: string;
                    preferredLanguage: string;
                };
            };
            output: {
                success: boolean;
                error: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/masjids/unpin": {
        $post: {
            input: {
                json: {
                    deviceId: string;
                    masjidId: string;
                };
            };
            output: {
                success: boolean;
                data: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                json: {
                    deviceId: string;
                    masjidId: string;
                };
            };
            output: {
                success: boolean;
                error: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/masjids/pinned": {
        $get: {
            input: {
                json: {
                    deviceId: string;
                };
            };
            output: {
                success: boolean;
                data: {
                    deviceId: string;
                    masjidId: string;
                    pushToken: string;
                    preferredLanguage: string;
                }[];
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                json: {
                    deviceId: string;
                };
            };
            output: {
                success: boolean;
                error: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/changePreferredLanguage": {
        $post: {
            input: {
                json: {
                    deviceId: string;
                    preferredLanguage: string;
                };
            };
            output: {
                success: boolean;
                data: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                json: {
                    deviceId: string;
                    preferredLanguage: string;
                };
            };
            output: {
                success: boolean;
                error: {
                    message: string;
                };
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/user"> | import("hono/types").MergeSchemaPath<{
    "/*": {};
} & {
    "/": {
        $get: {
            input: {};
            output: {
                success: boolean;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {};
            output: {
                success: boolean;
                data: {
                    id: string;
                    nameEn: string;
                    nameHi: string;
                    nameUr: string;
                    addressEn: string;
                    addressHi: string;
                    addressUr: string;
                    fajr: string | null;
                    dhuhr: string | null;
                    asr: string | null;
                    maghrib: string | null;
                    isha: string | null;
                    jummah: string | null;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/create": {
        $post: {
            input: {
                json: {
                    name: string;
                    address: string;
                };
            };
            output: {
                success: boolean;
                message: string;
            };
            outputFormat: "json";
            status: 409;
        } | {
            input: {
                json: {
                    name: string;
                    address: string;
                };
            };
            output: {
                success: boolean;
                message: string;
                data: {
                    id: string;
                    nameEn: string;
                    nameHi: string;
                    nameUr: string;
                    addressEn: string;
                    addressHi: string;
                    addressUr: string;
                    fajr: string | null;
                    dhuhr: string | null;
                    asr: string | null;
                    maghrib: string | null;
                    isha: string | null;
                    jummah: string | null;
                } | undefined;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/prayer-times": {
        $put: {
            input: {
                json: {
                    fajr?: string | null | undefined;
                    dhuhr?: string | null | undefined;
                    asr?: string | null | undefined;
                    maghrib?: string | null | undefined;
                    isha?: string | null | undefined;
                    jummah?: string | null | undefined;
                };
            };
            output: {
                success: boolean;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                json: {
                    fajr?: string | null | undefined;
                    dhuhr?: string | null | undefined;
                    asr?: string | null | undefined;
                    maghrib?: string | null | undefined;
                    isha?: string | null | undefined;
                    jummah?: string | null | undefined;
                };
            };
            output: {
                success: boolean;
                message: string;
                data: {
                    id: string;
                    nameEn: string;
                    nameHi: string;
                    nameUr: string;
                    addressEn: string;
                    addressHi: string;
                    addressUr: string;
                    fajr: string | null;
                    dhuhr: string | null;
                    asr: string | null;
                    maghrib: string | null;
                    isha: string | null;
                    jummah: string | null;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/masjid">, "/">;
declare const _default: {
    fetch: (request: Request, Env?: {} | Bindings | undefined, executionCtx?: import("hono").ExecutionContext) => Response | Promise<Response>;
};
export default _default;
export type AppType = typeof apiRoutes;
