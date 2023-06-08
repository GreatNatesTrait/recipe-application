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
      this.router.navigate(['/login']);
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

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
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
