declare const _default: {
    env: string;
    port: string | number;
    frontend_url: string;
    base_url: string;
    database_url: string | undefined;
    salt_rounds: number;
    jwt: {
        secret: string;
        expires_in: string;
        refresh_expires_in: string;
    };
    cookie: {
        name: string;
        refreshName: string;
        secure: boolean;
        httpOnly: boolean;
        sameSite: "lax";
        maxAge: number;
        refreshMaxAge: number;
    };
    redis_url: string;
};
export default _default;
//# sourceMappingURL=index.d.ts.map