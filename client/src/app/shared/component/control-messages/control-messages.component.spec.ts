import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlMessagesComponent } from './control-messages.component';

describe('ControlMessagesComponent', () => {
  let component: ControlMessagesComponent;
  let fixture: ComponentFixture<ControlMessagesComponent>;
  let signInForm : FormGroup;
  let builder : FormBuilder;
  
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ControlMessagesComponent],
        providers: [FormBuilder]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMessagesComponent);
    component = fixture.componentInstance;
    builder = TestBed.inject(FormBuilder);
    signInForm = builder.group({
      signinUsername: ['', Validators.required],
      signinPassword: ['', Validators.required]
    });
    component.control = signInForm.controls.signinUsername;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
