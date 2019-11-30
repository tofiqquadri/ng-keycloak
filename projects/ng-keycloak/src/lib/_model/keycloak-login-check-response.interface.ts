export interface KeycloakLoginCheckResponse {
    loggedIn: boolean;
    idmId: string;
    clientId: string;
    resourceAccess: any;
    idToken: any;
}