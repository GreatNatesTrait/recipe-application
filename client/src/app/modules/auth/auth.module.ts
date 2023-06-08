import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { CommonModule } from '@angular/common';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule,AuthRoutingModule, SharedModule,ReactiveFormsModule,FormsModule,AmplifyAuthenticatorModule ]
})
export class AuthModule {}
