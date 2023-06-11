import { Component} from '@angular/core';
import { AuthService } from '@app/shared/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  signupUsername: string;
  signupPassword: string;
  signupEmail: string;
  signinUsername: string;
  signinPassword: string;
  forgotPasswordUsername: string;
  confirmSignUpCode: string;
  resetPasswordCode: string;
  newPassword: string;
  activeTab: string = 'signin';
  isSignedUp : boolean;

  constructor(private authService: AuthService) {
    this.isSignedUp = false;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  async signUp() {
    try {
      const result = await this.authService.signUp(this.signupUsername, this.signupPassword, this.signupEmail);
      this.isSignedUp = true;
      console.log('Sign up successful', result);
    } catch (error) {
      console.log('Error signing up', error);
    }
  }

  async confirmSignUp() {
    try {
      const result = await this.authService.confirmSignUp(this.signupUsername, this.confirmSignUpCode);
      console.log('Confirm sign up successful', result);
      await this.authService.login(this.signupUsername, this.signupPassword)
    } catch (error) {
      console.log('Error confirming sign up', error);
    }
  }

  async signIn(){
    await this.authService.login(this.signinUsername, this.signinPassword)
  }

  async forgotPassword() {
    try {
      const result = await this.authService.forgotPassword(this.forgotPasswordUsername);
      console.log('Password recovery initiated', result);
    } catch (error) {
      console.log('Error initiating password recovery', error);
    }
  }

  async resetPassword() {
    try {
      const result = await this.authService.resetPassword(this.forgotPasswordUsername, this.resetPasswordCode, this.newPassword);
      console.log('Password reset successful', result);
    } catch (error) {
      console.log('Error resetting password', error);
    }
  }
}
