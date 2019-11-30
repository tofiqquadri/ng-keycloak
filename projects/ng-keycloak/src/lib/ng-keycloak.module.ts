import { NgModule } from '@angular/core';
import { NgKeycloakComponent } from './ng-keycloak.component';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakTokenDecorderService } from './_services/keycloak-token-decoder.service';

@NgModule({
  declarations: [NgKeycloakComponent],
  imports: [
    HttpClientModule
  ],
  providers: [KeycloakTokenDecorderService],
  exports: [NgKeycloakComponent]
})
export class NgKeycloakModule { }
