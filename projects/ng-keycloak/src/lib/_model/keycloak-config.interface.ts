export interface KeycloakConfig {
    BASE_URL: string;
    realm: string;
    clientId: string;
    credentials: {
        secret: string
    };
}
