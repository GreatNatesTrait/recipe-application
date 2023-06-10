import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeModel
 } from '@app/shared/models/recipe.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchResultsComponent implements OnInit  {
  tableRecipes: RecipeModel[];
  id: string | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }
  

  ngOnInit(){
    this.tableRecipes = history.state.data.recipes;
}

goToRecipe(meal){
  const singleRecipe = this.tableRecipes.filter(el => el.strMeal === meal);
  this.router.navigate(['/recipes', meal], {relativeTo: this.activatedRoute, state: {data: {recipeData: singleRecipe}}});
}
}
