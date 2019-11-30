import { TestBed } from '@angular/core/testing';

import { NgKeycloakService } from './ng-keycloak.service';

describe('NgKeycloakService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgKeycloakService = TestBed.get(NgKeycloakService);
    expect(service).toBeTruthy();
  });
});
