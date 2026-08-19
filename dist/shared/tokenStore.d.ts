export declare const tokenStore: {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds: number): Promise<void>;
    del(key: string): Promise<void>;
};
//# sourceMappingURL=tokenStore.d.ts.map