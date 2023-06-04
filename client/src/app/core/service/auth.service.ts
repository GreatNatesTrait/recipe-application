import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject, from } from 'rxjs';
import {Amplify,  Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { LocalStorageConfig } from '@app/shared/configs/local-storage.config';
import { IUser } from '@app/shared/models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticationSubject: BehaviorSubject<any>;
  private currentUser: any;
  private userSubject: Subject<any> = new Subject<any>();
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

   /**
   * set Token
   * @param data Token to be set
   */
   public setToken(data: string): void {
    localStorage.setItem(LocalStorageConfig.TOKEN, data.toString());
  }

  /**
   * get Token
   * @return Token fetched from local storage
   */
  public getToken(): string {
    if (
      localStorage.getItem(LocalStorageConfig.TOKEN) === undefined ||
      localStorage.getItem(LocalStorageConfig.TOKEN) === null ||
      localStorage.getItem(LocalStorageConfig.TOKEN) === ''
    ) {
      return '';
    } else {
      return localStorage.getItem(LocalStorageConfig.TOKEN) || '';
    }
  }

  /**
   * logout
   * clears local storage of certain items and redirects user to login page
   */

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password)
    .then((user) => {
      localStorage.setItem(LocalStorageConfig.TOKEN, JSON.stringify(user.username));
      this.loggedInSubject.next(true);
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    localStorage.removeItem(LocalStorageConfig.ME);
    localStorage.removeItem(LocalStorageConfig.TOKEN);
    return Auth.signOut()
    .then(() => {
      this.loggedInSubject.next(false);
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
        if (user) {
          this.setCurrentUser(user);
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
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

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem(LocalStorageConfig.ME, JSON.stringify(user.attributes.email));
    this.userSubject.next(user); // Emit the user object to subscribers
  }

  onUserLoggedIn(): Observable<any> {
    return this.userSubject.asObservable();
  }

  onUserLogout(): Observable<any> {
    return this.authenticationSubject.asObservable();
  }
}
