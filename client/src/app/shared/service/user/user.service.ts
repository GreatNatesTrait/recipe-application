import { Injectable, OnInit } from '@angular/core';
import {Amplify,  Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/service/auth/auth.service';
import { LoggerService } from '../log/logger.service';
import { RecipeDataService } from '@app/shared/service/data/recipe-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
   user:any;
  constructor(private authService: AuthService, private loggerService: LoggerService,    private dataService: RecipeDataService) { }

  async ngOnInit(){
    await this.getUser();
    console.log(this.user)
  }

  async getUser(): Promise<any> {
    //await Auth.currentUserInfo().then((user)=>this.user = user);
    await this.authService.getUser().then((user)=>this.user = user)
  }

  async getUserFavs(user):Promise<[]>{
    return await JSON.parse(user.attributes['custom:favorites']);
  }

  async getUserRecipes(user):Promise<any[]>{
    return await JSON.parse(user.attributes['custom:UserRecipes']);
  }

  addUserFav(){

  }

  removeUserFav(){

  }

  async addUserRecipe(user, idMeal){
    try {
      let userRecipes = await this.getUserRecipes(user);
      let updateUserAttributes = {};
        userRecipes.push(idMeal);
        updateUserAttributes = {
          'custom:UserRecipes': JSON.stringify(userRecipes)
        };
      await this.authService.updateUser(this.user, updateUserAttributes);
    } catch (error) {
      this.loggerService.warn(error)
    }
  }


  async deleteRecipe(idMeal){
    try {
      let userRecipes = null;
      const user = await this.authService.getUser();
      await this.dataService.deleteRecipe(idMeal);
      await this.getUserRecipes(user).then((data)=>userRecipes = data);

      let updateUserAttributes = {};
      userRecipes = userRecipes.filter((el)=>el !== idMeal)
        updateUserAttributes = {
          'custom:UserRecipes': JSON.stringify(userRecipes)
        };
        
      await this.authService.updateUser(user, updateUserAttributes);
    } catch (error) {
      this.loggerService.warn(error)
    }
  }


}
