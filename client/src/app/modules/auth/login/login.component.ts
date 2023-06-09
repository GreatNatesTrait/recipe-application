import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@app/shared/models/iuser.model';
import { Auth } from 'aws-amplify';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  user: IUser;
  verifingMe = false;
  username: string;
  password: string;
  email: string;
  confirmationCode: string;
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


  constructor(private router: Router, private authService: AuthService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  ngOnInit(): void {
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  async signUp() {
    try {
      const result = await this.authService.signUp(this.signupUsername, this.signupPassword, this.signupEmail);
      console.log('Sign up successful', result);

      // Optionally display a success message to the user
    } catch (error) {
      console.log('Error signing up', error);
      // Display an error message to the user
    }
  }

  async confirmSignUp() {
    try {
      const result = await this.authService.confirmSignUp(this.signupUsername, this.confirmSignUpCode);
      console.log('Confirm sign up successful', result);
      // Optionally display a success message to the user
    } catch (error) {
      console.log('Error confirming sign up', error);
      // Display an error message to the user
    }
  }

  async signIn(){
    await this.authService.login(this.signinUsername, this.signinPassword)
  }

  async forgotPassword() {
    try {
      const result = await this.authService.forgotPassword(this.forgotPasswordUsername);
      console.log('Password recovery initiated', result);
      // Optionally display a success message to the user
    } catch (error) {
      console.log('Error initiating password recovery', error);
      // Display an error message to the user
    }
  }

  async resetPassword() {
    try {
      const result = await this.authService.resetPassword(this.forgotPasswordUsername, this.resetPasswordCode, this.newPassword);
      console.log('Password reset successful', result);
      // Optionally display a success message to the user
    } catch (error) {
      console.log('Error resetting password', error);
      // Display an error message to the user
    }
  }

  async signOut() {
    try {
      const result = await this.authService.signout();
      console.log('Sign out successful', result);
      // Optionally display a success message to the user
    } catch (error) {
      console.log('Error signing out', error);
      // Display an error message to the user
    }
  }
}
