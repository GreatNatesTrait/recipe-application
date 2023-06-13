// import { Component} from '@angular/core';
// import { AuthService } from '@app/shared/service/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent{
//   signupUsername: string;
//   signupPassword: string;
//   signupEmail: string;
//   signinUsername: string;
//   signinPassword: string;
//   forgotPasswordUsername: string;
//   confirmSignUpCode: string;
//   resetPasswordCode: string;
//   newPassword: string;
//   activeTab: string = 'signin';
//   isSignedUp : boolean;

//   constructor(private authService: AuthService) {
//     this.isSignedUp = false;
//   }

//   setActiveTab(tab: string) {
//     this.activeTab = tab;
//   }

//   async signUp() {
//     try {
//       const result = await this.authService.signUp(this.signupUsername, this.signupPassword, this.signupEmail);
//       this.isSignedUp = true;
//       console.log('Sign up successful', result);
//     } catch (error) {
//       console.log('Error signing up', error);
//     }
//   }

//   async confirmSignUp() {
//     try {
//       const result = await this.authService.confirmSignUp(this.signupUsername, this.confirmSignUpCode);
//       console.log('Confirm sign up successful', result);
//       await this.authService.login(this.signupUsername, this.signupPassword)
//     } catch (error) {
//       console.log('Error confirming sign up', error);
//     }
//   }

//   async signIn(){
//     await this.authService.login(this.signinUsername, this.signinPassword)
//   }

//   async forgotPassword() {
//     try {
//       const result = await this.authService.forgotPassword(this.forgotPasswordUsername);
//       console.log('Password recovery initiated', result);
//     } catch (error) {
//       console.log('Error initiating password recovery', error);
//     }
//   }

//   async resetPassword() {
//     try {
//       const result = await this.authService.resetPassword(this.forgotPasswordUsername, this.resetPasswordCode, this.newPassword);
//       console.log('Password reset successful', result);
//     } catch (error) {
//       console.log('Error resetting password', error);
//     }
//   }
// }

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/shared/service/auth.service';

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
    private authService: AuthService
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
      this.authEventMessage = 'Error signing up';
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
    }
  }

  async signIn() {
    try {
      await this.authService.login(
        this.signInForm.value.signinUsername,
        this.signInForm.value.signinPassword
      );
    } catch (error) {
      console.log('Error signing in', error);
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
      this.authEventMessage = 'Error initiating password recovery';
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
      this.authEventMessage = 'Error resetting password';
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
