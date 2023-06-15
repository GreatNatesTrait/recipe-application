import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/shared/service/auth.service';
import { NGXLogger } from "ngx-logger";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  activeTab: string = 'signin';
  isSignedUp: boolean;
  authEventMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private logger: NGXLogger
  ) {
    this.isSignedUp = false;
    this.signInForm = this.formBuilder.group({
      signinUsername: ['', Validators.required],
      signinPassword: ['', Validators.required]
    });
    this.signUpForm = this.formBuilder.group({
      signupUsername: ['', Validators.required],
      signupPassword: ['', Validators.required],
      signupEmail: ['', [Validators.required, Validators.email]]
      //,
      //confirmSignUpCode: ['', Validators.required]
    });
    this.forgotPasswordForm = this.formBuilder.group({
      forgotPasswordUsername: ['', Validators.required]
    });
    this.resetPasswordForm = this.formBuilder.group({
      resetPasswordUsername: ['', Validators.required],
      resetPasswordCode: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  async signUp() {
    try {
      const result = await this.authService.signUp(
        this.signUpForm.value.signupUsername,
        this.signUpForm.value.signupPassword,
        this.signUpForm.value.signupEmail
      );
      this.isSignedUp = true;
      console.log('Sign up successful', result);
      this.authEventMessage = 'Sign up successful';
    } catch (error) {
      console.log('Error signing up', error);
      this.authEventMessage = error;
    }
  }

  async confirmSignUp() {
    try {
      const result = await this.authService.confirmSignUp(
        this.signUpForm.value.signupUsername,
        this.signUpForm.value.confirmSignUpCode
      );
      console.log('Confirm sign up successful', result);
      await this.authService.login(
        this.signUpForm.value.signupUsername,
        this.signUpForm.value.signupPassword
      );
    } catch (error) {
      console.log('Error confirming sign up', error);
      this.authEventMessage = error;
    }
  }

  async signIn() {
    try {
      const result = await this.authService.login(
        this.signInForm.value.signinUsername,
        this.signInForm.value.signinPassword
      );
      this.authEventMessage = result;
    } catch (error) {
      console.log('Error signing in', error);
      this.authEventMessage = error;
      this.logger.error(error);
    }
  }

  async forgotPassword() {
    try {
      const result = await this.authService.forgotPassword(
        this.forgotPasswordForm.value.forgotPasswordUsername
      );
      console.log('Password recovery initiated', result);
      this.authEventMessage = 'Password recovery initiated';
    } catch (error) {
      console.log('Error initiating password recovery', error);
      this.authEventMessage = error;
    }
  }

  async resetPassword() {
    try {
      const result = await this.authService.resetPassword(
        this.resetPasswordForm.value.resetPasswordUsername,
        this.resetPasswordForm.value.resetPasswordCode,
        this.resetPasswordForm.value.newPassword
      );
      console.log('Password reset successful', result);
      this.authEventMessage = 'Password reset successful';
    } catch (error) {
      console.log('Error resetting password', error);
      this.authEventMessage = error;
    }
  }

  signInHasErrors(): boolean {
    return this.signInForm.invalid;
  }

  signUpHasErrors(): boolean {
    return this.signUpForm.invalid;
  }

  passwordRecoveryHasErrors(): boolean {
    return this.forgotPasswordForm.invalid;
  }

  resetPasswordHasErrors(): boolean {
    return this.resetPasswordForm.invalid;
  }
  
}
