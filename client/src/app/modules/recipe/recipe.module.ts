import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeRoutingModule } from './recipe.routing';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [RecipeDetailComponent,RecipesComponent],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    SharedModule
  ]
})
export class RecipeModule { }
