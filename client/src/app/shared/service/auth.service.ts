import { Injectable } from '@angular/core';
import {Amplify,  Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { IUser } from '@app/shared/models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean;

  constructor(private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });
  }

  async signUp(username: string, password: string, email: string): Promise<any> {
    try {
      const result = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }


  async confirmSignUp(username: string, code: string): Promise<any> {
    try {
      const result = await Auth.confirmSignUp(username, code);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(username: string): Promise<any> {
    try {
      const result = await Auth.forgotPassword(username);
      return result;
    } catch (error) {
      throw error;
    }
  }


  async resetPassword(username: string, code: string, newPassword: string): Promise<any> {
    try {
      const result = await Auth.forgotPasswordSubmit(username, code, newPassword);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(username: string, password: string): Promise<void> {
    try {
      await Auth.signIn(username, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.log('Error signing in', error);
    }
  }

  async signout(): Promise<void> {
    try {
      await Auth.signOut();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.log('Error signing out', error);
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }
}
