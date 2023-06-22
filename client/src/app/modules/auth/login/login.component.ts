import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/shared/service/auth/auth.service';
import { LoggerService } from '@app/shared/service/log/logger.service';

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
    private logger: LoggerService

  ) {
    this.isSignedUp = false;
    this.signInForm = this.formBuilder.group({
      signinUsername: ['', Validators.required],
      signinPassword: ['', Validators.required]
    });
    this.signUpForm = this.formBuilder.group({
      signupUsername: ['', Validators.required],
      signupPassword: ['', Validators.required],
      signupEmail: ['', [Validators.required, Validators.email]],
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
      this.authEventMessage = 'Sign up successful';
    } catch (error) {
      this.handleAuthError(error);
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
      this.handleAuthError(error);
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
        this.handleAuthError(error);
    }
  }

  async forgotPassword() {
    try {
      const result = await this.authService.forgotPassword(
        this.forgotPasswordForm.value.forgotPasswordUsername
      );
      this.authEventMessage = 'Password recovery initiated';
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  async resetPassword() {
    try {
      const result = await this.authService.resetPassword(
        this.resetPasswordForm.value.resetPasswordUsername,
        this.resetPasswordForm.value.resetPasswordCode,
        this.resetPasswordForm.value.newPassword
      );
      this.authEventMessage = 'Password reset successful';
    } catch (error) {
      this.handleAuthError(error);
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

  handleAuthError(error): void{
    this.authEventMessage = error;
    this.logger.error(error);
  }
  
}
