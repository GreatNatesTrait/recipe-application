import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeModel } from '@app/shared/models/recipe.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent {
@Input() userFavs;

constructor(
  private router: Router,
  private activatedRoute: ActivatedRoute
) {}

navigateToRecipeDetails(meal) {
  const singleRecipe = this.userFavs.filter(
    (el) => el.strMeal === meal
  );
  this.router.navigate(['/recipes', meal], {
    relativeTo: this.activatedRoute,
    state: { data: { recipeData: singleRecipe } }
  });
}
}
