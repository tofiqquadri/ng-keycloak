# NgKeycloak

* This is a simple library that provides capability to enable Keycloak Open-Id connect REST Login, Logout and Check Session.

* It is developed using Angular >=8.0.0 and its newly introduced ng g library schematics.
Library location: projects/ng-keycloak directory of this repository.

# Examples/Demo

* A simple Example can be found under src/app directory of this repository. You can update the keycloak configuration with yours in the app/shared/config location.

* In case your keycloak server is on different domain use angular proxy-config to run the project with redirect to the keycloak server and provide BASE_URL = '' in the keycloakConfig when setting the library configuration and redirect the /auth api requests to your keycloak server using proxy config.

* You can find sample proxy config file in the src/ directory of this repository.

# Installation
`npm i ng-keycloak`

# API
`import { NgKeycloakModule } from 'ng-keycloak';`

# Usage

```typescript
// Register the NgKeycloakModule in your app module.
import { NgKeycloakModule } from 'ng-keycloak';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgKeycloakModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

# Use the import NgKeycloakService in your component.

```typescript
import { Component, OnInit } from '@angular/core';
import { NgKeycloakService } from 'ng-keycloak';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  username = 'YOUR_KEYCLOAK_USERNAME_TO_LOGIN';
  password = 'YOUR_KEYCLOAK_PASSWORD_TO_LOGIN';

  // The BASE_URL is empty in case the proxy-config is used from Angular to resolve the CORS error
  // If the CORS error is not present use the BASE URL as the keycloak url with the port number
  // Example BASE_URL = 'http://13.43.53.42:30224'
  keycloakConfig = {
    BASE_URL: '',
    realm: 'YOUR_REALM_NAME',
    clientId: 'YOUR_CLIENT_ID',
    credentials: {
        secret: 'YOUR_CLIENT_SECRET'
    }
  };

  constructor(private ngKeycloakService: NgKeycloakService) { }

  ngOnInit(): void {

    // You need to set the Keycloak Configuration using _setkeycloakConfig(config) method before you
    // can use the Library
    this.ngKeycloakService._setkeycloakConfig(keycloakConfig);

    this.ngKeycloakService.logout().pipe().subscribe(logoutSuccessResponse => {
      console.log('Logout Success Response', logoutSuccessResponse);
    }, (logoutErrorResponse) => {
      console.log('Logout Error', logoutErrorResponse);
    });

    this.ngKeycloakService.login(this.username, this.password).pipe().subscribe(loginSuccessResponse => {
      console.log('Login Success', loginSuccessResponse);
    }, (loginErrorResponse) => {
      console.log('Login Error Response', loginErrorResponse);
    });

    this.ngKeycloakService.isLoggedIn().pipe().subscribe(loginStatusResponse => {
      console.log('Login Check Status', loginStatusResponse);
    }, (loginStatusErrorResponse) => {
      console.log('Login Check Status Error', loginStatusErrorResponse);
    });
  }

}
```
# Credits

This project is based on keycloak openid connect REST API interface. This is the first library developed my me in the Angular community with motivation from my friend Akshay Jain. Also want to thank the entire Angular team for creating this awesome framework.

## Running the example in local env

* `npm i`
* Run `ng serve` for a dev server and running the demo app. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

* Also you need to add your keycloak configuration before you can test the application.

# NgKeycloak

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

## Services

For web development and related services visit us at: https://developershive.com
Mail us at: contact@developershive.com

## Author

Name: Tofiq Quadri
Email: tofiqquadri@developershive.com