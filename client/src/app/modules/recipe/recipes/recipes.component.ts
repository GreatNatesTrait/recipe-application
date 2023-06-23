import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeDataService } from '@app/shared/service/data/recipe-data.service';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { AuthService } from '@app/shared/service/auth/auth.service';
import { LoggerService } from '@app/shared/service/log/logger.service';
import { UserService } from '@app/shared/service/user/user.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  user: any;
  lastEvaluatedKey: string;
  recipeData: RecipeModel[] = [];
  isLoading: boolean;
  isMoreLoading: boolean;
  userFavorites = [];
  loadingMessage = 'Loading';

  constructor(
    private dataService: RecipeDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private loggerService: LoggerService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.dataService.getRecipeData().then((data) => {
      (this.recipeData = data.items),
        (this.lastEvaluatedKey = data.lastEvaluatedKey);
    });
    this.isLoading = false;
    this.user = await this.authService.getUser();

    if (this.user) {
      await this.getUserFavorites();
    }
  }

  async getUserFavorites() {
    this.user = await this.authService.getUser();
    this.userFavorites =await this.userService.getUserFavs(this.user);
  }

  async getMoreRecipes() {
    this.isMoreLoading = true;
    await this.dataService.getRecipeData(this.lastEvaluatedKey).then((data) => {
      (this.recipeData = this.recipeData.concat(data.items)),
        (this.lastEvaluatedKey = data.lastEvaluatedKey);
    });
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
        this.removeFav(id);
        this.changeDetectorRef.detectChanges();
        return;
      }
      this.userFavorites.push(id);
      updateUserAttributes = {
        'custom:favorites': JSON.stringify(this.userFavorites)
      };
      await this.authService.updateUser(this.user, updateUserAttributes);
      await this.getUserFavorites();
    } catch (error) {
      this.loggerService.warn(error);
    }
  }

  async removeFav(id): Promise<void> {
    let removeFav = this.userFavorites.filter((el) => el !== id);
    let updateUserAttributes = {
      'custom:favorites': JSON.stringify(removeFav)
    };
    await this.authService.updateUser(this.user, updateUserAttributes);
    await this.getUserFavorites();
  }
}
