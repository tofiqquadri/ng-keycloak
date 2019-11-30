import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { take } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpBackend } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { KeycloakConfig } from './_model/keycloak-config.interface';
import { KeycloakTokenDecorderService } from './_services/keycloak-token-decoder.service';
import { KeycloakLoginCheckResponse } from './_model/keycloak-login-check-response.interface';
import { NoKeycloakConfigError } from './_model/no-keycloak-config-error.interface';

@Injectable({
  providedIn: 'root'
})
export class NgKeycloakService {

  private httpClient: HttpClient;
  private keycloakConfig: KeycloakConfig = null;

  constructor(
    private handler: HttpBackend,
    private keycloakTokenDecorderService: KeycloakTokenDecorderService
  ) {
    this.httpClient = new HttpClient(handler);
  }

  public _setkeycloakConfig(keycloakConfig: KeycloakConfig) {
    this.keycloakConfig = keycloakConfig;
  }

  isLoggedIn(): Observable<KeycloakLoginCheckResponse | NoKeycloakConfigError> {

    const keycloakObserver = Observable.create((observer: Observer<KeycloakLoginCheckResponse | NoKeycloakConfigError>) => {
      try {

        this.checkKeycloakConfig(observer);
        const localStorageKeycloakDetails = localStorage.getItem('keycloak');
        const keycloakDetails = localStorageKeycloakDetails ? JSON.parse(localStorageKeycloakDetails) : {};

        this.keycloakTokenHandler(keycloakDetails, this.keycloakConfig, observer);

      } catch (error) {
        this.loginErrorHandler(observer);
      }
    });
    return keycloakObserver;
  }


  login(username: any, password: any): Observable<any> {

    const keycloakObserver = Observable.create((observer: Observer<KeycloakLoginCheckResponse | NoKeycloakConfigError>) => {

      this.checkKeycloakConfig(observer);

      const urlEncodedKeyclockConfigData = new HttpParams({
        fromObject: {
          client_id: this.keycloakConfig.clientId,
          client_secret: this.keycloakConfig.credentials.secret,
          username,
          password,
          grant_type: 'password'
        }
      });

      const httpOptionsForKeycloakTokenAuthentication = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      };

      this.httpClient.post(this.keycloakConfig.BASE_URL + '/auth/realms/' + this.keycloakConfig.realm + '/protocol/openid-connect/token',
        urlEncodedKeyclockConfigData, httpOptionsForKeycloakTokenAuthentication)
        .pipe(take(1)).subscribe((keycloakLoginResponse: any) => {

          localStorage.setItem('realm', this.keycloakConfig.realm);
          localStorage.setItem('keycloak', JSON.stringify(keycloakLoginResponse));

          this.keycloakTokenHandler(keycloakLoginResponse, this.keycloakConfig, observer);
        }, (error) => {
          this.loginErrorHandler(observer);
        });
    });
    return keycloakObserver;
  }

  private keycloakTokenHandler(keycloakLoginResponse: any, keycloakConfig: any, observer: Observer<any>) {
    this.keycloakTokenDecorderService
      .getDecodedTokenFromIntrospector(keycloakLoginResponse.access_token, keycloakConfig.realm, keycloakConfig)
      .subscribe((decodedKeycloakTokenResponse: any) => {
        if (decodedKeycloakTokenResponse.active) {
          const loginCheckResponse = this.getKeycloakLoginCheckResponseFromDecodedToken(decodedKeycloakTokenResponse,
            keycloakLoginResponse);
          observer.next(loginCheckResponse);
        } else {
          this.loginErrorHandler(observer);
        }
      }, (error) => {
        this.loginErrorHandler(observer);
      });
  }

  getKeycloakLoginCheckResponseFromDecodedToken(decodedToken: any = { active: false }, keycloak: any = {})
    : KeycloakLoginCheckResponse {
    return {
      loggedIn: decodedToken.active,
      idmId: decodedToken.session_state,
      clientId: decodedToken.azp,
      resourceAccess: decodedToken.resource_access,
      idToken: keycloak.access_token
    };
  }

  // TODO: Implement Token Update Method
  // updateToken(): Observable<string> {
  //   const updateToken = this.keycloak.updateToken(5);
  //   return Observable.create((observer: Observer<string>) => {
  //     updateToken.success(_ => observer.next(this.keycloak.token));
  //     updateToken.error(data => observer.error(data));
  //   });
  // }

  logout(): Observable<void> {

    const localStorageKeycloakDetails = localStorage.getItem('keycloak');
    const keycloakDetails = localStorageKeycloakDetails ? JSON.parse(localStorageKeycloakDetails) : {};

    const keycloakObserver = Observable.create((observer: Observer<any>) => {

      this.checkKeycloakConfig(observer);

      const params = new HttpParams({
        fromObject: {
          client_id: this.keycloakConfig.clientId,
          client_secret: this.keycloakConfig.credentials.secret,
          refresh_token: keycloakDetails.refresh_token
        }
      });

      let headers = new HttpHeaders({});
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
      headers = headers.set('Authorization', 'Bearer ' + keycloakDetails.access_token);

      const httpOptions = { headers };

      this.httpClient.post(this.keycloakConfig.BASE_URL + '/auth/realms/' +
        this.keycloakConfig.realm + '/protocol/openid-connect/logout',
        params, httpOptions)
        .pipe(take(1)).subscribe((keycloakLogoutResponse: any) => {
          localStorage.removeItem('realm');
          localStorage.removeItem('keycloak');
          observer.next({ response: keycloakLogoutResponse });
        }, (error) => {
          observer.next({ error });
        });
    });

    return keycloakObserver;
  }

  private loginErrorHandler(observer: Observer<any>) {
    observer.error({
      loggedIn: false,
      idmId: null,
      clientId: '',
      resourceAccess: {},
      idToken: null
    });
  }

  private checkKeycloakConfig(observer: Observer<any>) {
    if (!this.keycloakConfig) {
      observer.next({
        error: 'No Keycloak Configuration Available',
        message: 'Set a Keycloak Configuration as directed in the Official Documentation of the Library'
      });

      observer.complete();
    }
  }
}
