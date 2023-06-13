import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeRoutingModule } from './recipe.routing';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SharedModule } from '@shared/shared.module';
import { IngredientsComponent } from './recipe-detail/ingredients/ingredients.component';
import { VideoComponent } from './recipe-detail/video/video.component';
import { InstructionsComponent } from './recipe-detail/instructions/instructions.component';
import { RecipeCreationComponent } from './recipe-creation/recipe-creation.component';

@NgModule({
  declarations: [InstructionsComponent, RecipeDetailComponent,RecipesComponent,IngredientsComponent,VideoComponent, RecipeCreationComponent],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    SharedModule
  ]
})
export class RecipeModule { }
