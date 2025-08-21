import type { Bindings, Variables } from "@api/index";
declare const userRoutes: import("hono/hono-base").HonoBase<{
    Bindings: Bindings;
    Variables: Variables;
}, {
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
}, "/">;
export default userRoutes;
