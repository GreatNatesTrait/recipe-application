import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEventMessagesComponent } from './auth-event-messages.component';

describe('AuthEventMessagesComponent', () => {
  let component: AuthEventMessagesComponent;
  let fixture: ComponentFixture<AuthEventMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthEventMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthEventMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
