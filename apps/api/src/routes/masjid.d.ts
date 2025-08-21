import type { Bindings, Variables } from "@api/index";
declare const masjidRoutes: import("hono/hono-base").HonoBase<{
    Bindings: Bindings;
    Variables: Variables;
}, {
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
}, "/">;
export default masjidRoutes;
