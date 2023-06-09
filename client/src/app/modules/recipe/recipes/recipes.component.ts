import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeDataService } from '@app/data/service/recipe-data.service';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { Auth } from 'aws-amplify';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  user: any;
  lastEvaluatedKey:any;
  recipeAPIData: any;
  recipeData: RecipeModel[] = [];
  additionalRecipeData: RecipeModel[] = [];
  moreRecipes: any;
  loading = true;
  favoriteStatus: boolean[] = new Array(this.recipeData.length).fill(false);
  existingFavs = [];
  constructor(
    private dataService: RecipeDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.recipeAPIData = await this.dataService.getRecipeData();
    this.recipeData = this.recipeAPIData.items;
    this.lastEvaluatedKey = this.recipeAPIData.lastEvaluatedKey;
    console.log(this.recipeData)
    console.log(this.lastEvaluatedKey)
    this.loading = false;
    await this.getFavs();
    
  }

  async getFavs() {
    this.user = await Auth.currentAuthenticatedUser();
    this.existingFavs = JSON.parse(this.user.attributes['custom:favorites']);
  }

  async getMoreRecipes(){
    this.moreRecipes = await this.dataService.getRecipeData(this.lastEvaluatedKey);
    console.log(this.moreRecipes)
    this.additionalRecipeData = this.moreRecipes.items;
    let test = this.recipeData.concat(this.additionalRecipeData);
    console.log(test);
    this.recipeData = test;
  }

  async byCat(): Promise<RecipeModel[]>{
   let cat = await this.dataService.searchRecipesByCategory('Dessert');
   console.log(cat);
   return cat
  }

  navigateToDynamicComponent(pathParam: string) {
    const singleRecipe = this.recipeData.filter(
      (el) => el.strMeal === pathParam
    );
    this.router.navigate(['/recipes', pathParam], {
      relativeTo: this.activatedRoute,
      state: { data: { recipeData: singleRecipe } }
    });
  }

  async toggleFav(index: number, id) {
    await this.setFavorite(id);
    this.toggle(index);
  }

  toggle(index: number) {
    this.favoriteStatus[index] = !this.favoriteStatus[index];
  }

  isFavorite(id: any) {
    return this.existingFavs.filter((el) => el === id).length;
  }

  async setFavorite(id) {
    console.log(this.existingFavs);
    try {
      let updateUserAttributes = {};
      const user = await Auth.currentAuthenticatedUser();
      let isAlreadyFav = this.existingFavs.filter((el) => el === id).length;


      if (isAlreadyFav) {
        console.log('already fav');
        let removeFav = this.existingFavs.filter((el) => el !== id);
        console.log(removeFav);
        updateUserAttributes = {
          'custom:favorites': JSON.stringify(removeFav)
        };
        await Auth.updateUserAttributes(user, updateUserAttributes);
        await this.getFavs();

        console.log(this.existingFavs);
        this.changeDetectorRef.detectChanges();
        return;
      }

      if (this.existingFavs) {
        this.existingFavs.push(id);
        updateUserAttributes = {
          'custom:favorites': JSON.stringify(this.existingFavs)
        };
      }
      await Auth.updateUserAttributes(user, updateUserAttributes);

      await this.getFavs();
      console.log('Custom attributes updated successfully', this.existingFavs);
      //console.log(user);
    } catch (error) {
      console.error('Error updating custom attributes:', error);
    }
  }
}
