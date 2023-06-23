import { Injectable, OnInit } from '@angular/core';
import {Amplify,  Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/service/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
   user:any;
  constructor(private authService: AuthService) { }

  async ngOnInit(){
  }

  async getUser(): Promise<any> {
    await Auth.currentUserInfo().then((user)=>this.user = user);
  }

  async getUserFavs(user):Promise<[]>{
    return await JSON.parse(user.attributes['custom:favorites']);
  }

  getUserRecipes(user):[]{
    return JSON.parse(user.attributes['custom:UserRecipes']);
  }

  addUserFav(){

  }

  removeUserFav(){

  }

  addUserRecipe(){
    
  }


}
