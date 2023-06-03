import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

export const routes: Routes = [
  
  {
    path: '',
    component: RecipesComponent}
    ,
    
      {
        path: ':name',
        component: RecipeDetailComponent
      }
    
  ]

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class RecipeRoutingModule { }
