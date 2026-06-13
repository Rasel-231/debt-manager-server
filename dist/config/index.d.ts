declare const _default: {
    env: string;
    port: string | number;
    frontend_url: string | undefined;
    base_url: string | undefined;
    database_url: string | undefined;
    salt_rounds: number;
    jwt: {
        secret: string;
        expires_in: string;
        refresh_expires_in: string;
    };
    cloudinary: {
        cloud_name: string | undefined;
        api_key: string | undefined;
        api_secret: string | undefined;
    };
    ai_api_key: string | undefined;
    sslcommerz: {
        store_id: string | undefined;
        store_password: string | undefined;
        is_live: boolean;
    };
    email: {
        app_password: string | undefined;
        support_email: string | undefined;
    };
    redis_url: string;
};
export default _default;
//# sourceMappingURL=index.d.ts.map