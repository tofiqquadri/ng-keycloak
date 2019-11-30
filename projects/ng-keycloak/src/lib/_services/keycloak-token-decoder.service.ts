import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpBackend } from '@angular/common/http';
import { KeycloakConfig } from '../_model/keycloak-config.interface';

@Injectable()
export class KeycloakTokenDecorderService {

    private httpClient: HttpClient;

    constructor(private handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
    }

    getDecodedTokenFromIntrospector(token: string, realm: string, keycloakConfig: KeycloakConfig) {

        const params = new HttpParams({
            fromObject: {
                token,
                client_id: keycloakConfig.clientId,
                client_secret: keycloakConfig.credentials.secret
            }
        });

        let headers = new HttpHeaders({});
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const interospectURL = keycloakConfig.BASE_URL + '/auth/realms/' + realm + '/protocol/openid-connect/token/introspect';

        const httpOptions = { headers };

        return this.httpClient.post(interospectURL, params, httpOptions);
    }

}
