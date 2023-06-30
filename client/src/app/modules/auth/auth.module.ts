import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { CommonModule } from '@angular/common';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AuthEventMessagesComponent } from './login/auth-event-messages/auth-event-messages.component';

@NgModule({
  declarations: [LoginComponent, AuthEventMessagesComponent],
  imports: [CommonModule,AuthRoutingModule, SharedModule,ReactiveFormsModule,FormsModule,AmplifyAuthenticatorModule ]
})
export class AuthModule {}
