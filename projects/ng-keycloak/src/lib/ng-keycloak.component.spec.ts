import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgKeycloakComponent } from './ng-keycloak.component';

describe('NgKeycloakComponent', () => {
  let component: NgKeycloakComponent;
  let fixture: ComponentFixture<NgKeycloakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgKeycloakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgKeycloakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
