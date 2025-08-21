export declare function hash(password: string): Promise<string>;
export declare function verify({ password, hash, }: {
    password: string;
    hash: string;
}): Promise<boolean>;
