import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeModel } from '@app/shared/models/recipe.model';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})

export class RecipeDetailComponent implements OnInit{
  Object = Object;
  activeRecipe: RecipeModel;
  id: string | null = null;
  videoUrl :string;
  ingredients: Object;
  measurements: Object;
  instructions: Object;
  

  constructor(private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('name');
    this.activeRecipe = history.state.data.recipeData[0];
    this.videoUrl = this.activeRecipe.strYoutube;
    this.ingredients = this.activeRecipe.strIngredient;
    this.measurements = this.activeRecipe.strMeasure;
    console.log(this.activeRecipe.strInstructions)
    this.instructions = (this.activeRecipe.strInstructions.split('[BREAK]')).filter(el=>el !== '')
    console.log(this.instructions)
  }



  

  

}
