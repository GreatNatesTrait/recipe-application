import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeDataService } from '@app/shared/service/data/recipe-data.service';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})

export class RecipesComponent implements OnInit {
  user: any;
  lastEvaluatedKey:any;
  recipeDataApiCall: any;
  moreRecipes: any;
  recipeData: RecipeModel[] = [];
  additionalRecipeData: RecipeModel[] = [];
  isLoading : boolean;
  isMoreLoading : boolean;
  userFavorites = [];
  loadingMessage = 'Loading';

  constructor(
    private dataService: RecipeDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.recipeDataApiCall = await this.dataService.getRecipeData();
    this.recipeData = this.recipeDataApiCall.items;
    this.lastEvaluatedKey = this.recipeDataApiCall.lastEvaluatedKey;
    this.isLoading = false;
    await this.getUser();

    if(this.user){
    await this.getUserFavorites();
    }
  }

  async getUser(){
    this.user = await Auth.currentAuthenticatedUser();
  }

  async getUserFavorites() {
    await this.getUser();
    this.userFavorites = JSON.parse(this.user.attributes['custom:favorites']);
  }

  async getMoreRecipes(){
    this.isMoreLoading = true;
    this.moreRecipes = await this.dataService.getRecipeData(this.lastEvaluatedKey);
    this.additionalRecipeData = this.moreRecipes.items;
    this.recipeData = this.recipeData.concat(this.additionalRecipeData);
    this.isMoreLoading = false;
  }

  navigateToRecipeDetails(recipeName: string) {
    const singleRecipe = this.recipeData.filter(
      (el) => el.strMeal === recipeName
    );
    this.router.navigate(['/recipes', recipeName], {
      relativeTo: this.activatedRoute,
      state: { data: { recipeData: singleRecipe } }
    });
  }

  async toggleFav(id) {
    await this.setFavorite(id);
  }

  isFavorite(id: any) {
    return this.userFavorites.filter((el) => el === id).length;
  }

  async setFavorite(id) {
    try {
      let updateUserAttributes = {};
      let isAlreadyFav = this.userFavorites.filter((el) => el === id).length;

      if (isAlreadyFav) {
        let removeFav = this.userFavorites.filter((el) => el !== id);
        updateUserAttributes = {
          'custom:favorites': JSON.stringify(removeFav)
        };
        await Auth.updateUserAttributes(this.user, updateUserAttributes);
        await this.getUserFavorites();

        this.changeDetectorRef.detectChanges();
        return;
      }

      if (this.userFavorites) {
        this.userFavorites.push(id);
        updateUserAttributes = {
          'custom:favorites': JSON.stringify(this.userFavorites)
        };
      }
      await Auth.updateUserAttributes(this.user, updateUserAttributes);

      await this.getUserFavorites();
      console.log('Custom attributes updated successfully', this.userFavorites);
      console.trace();
    } catch (error) {
      console.error('Error updating custom attributes:', error);
    }
  }
}
