import { Component, OnInit } from '@angular/core';
import { NgKeycloakService } from 'projects/ng-keycloak/src/public-api';
import { keycloakConfig } from 'src/app/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  username = 'YOUR_KEYCLOAK_USERNAME_TO_LOGIN';
  password = 'YOUR_KEYCLOAK_PASSWORD_TO_LOGIN';

  constructor(private ngKeycloakService: NgKeycloakService) { }

  ngOnInit(): void {
    this.ngKeycloakService._setkeycloakConfig(keycloakConfig);

    this.ngKeycloakService.logout().pipe().subscribe(logoutSuccessResponse => {
      console.log('Logout Success Response', logoutSuccessResponse);
    }, (logoutError) => {
      console.log('Logout Error', logoutError);
    });

    this.ngKeycloakService.login(this.username, this.password).pipe().subscribe(loginSuccessResponse => {
      console.log('Login Success', loginSuccessResponse);
    }, (loginErrorResponse) => {
      console.log('Login Error Response', loginErrorResponse);
    });

    this.ngKeycloakService.isLoggedIn().pipe().subscribe(loginStatusResponse => {
      console.log('Login Check Status', loginStatusResponse);
    });
  }

}
