import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeDataService } from '@app/shared/service/data/recipe-data.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRecipesComponent {
  @Input() userRecipes;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: RecipeDataService
  ) {}

  navigateToRecipeDetails(meal) {
    const singleRecipe = this.userRecipes.filter(
      (el) => el.strMeal === meal
    );
    this.router.navigate(['/recipes', meal], {
      relativeTo: this.activatedRoute,
      state: { data: { recipeData: singleRecipe } }
    });
  }

  async deleteRecipe(id){
    await this.dataService.deleteRecipe(id);
  }
}
