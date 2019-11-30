import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgKeycloakModule } from 'projects/ng-keycloak/src/public-api';

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
