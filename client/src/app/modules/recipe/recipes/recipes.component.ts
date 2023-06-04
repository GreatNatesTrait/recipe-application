import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeDataService } from '@app/data/service/recipe-data.service';
import { RecipeModel } from '@app/shared/models/recipe.model';



@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  constructor(private dataService: RecipeDataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  recipeData : RecipeModel[] = [];
  loading = true;

  async ngOnInit(): Promise<void> {
    this.recipeData = await this.dataService.getRecipeData();
    console.log(this.recipeData);
    this.loading = false;
  }

  navigateToDynamicComponent(pathParam: string) {
    const singleRecipe = this.recipeData.filter(el => el.strMeal === pathParam);
    this.router.navigate(['/recipes', pathParam], {relativeTo: this.activatedRoute, state: {data: {recipeData: singleRecipe}}});
  }
}
