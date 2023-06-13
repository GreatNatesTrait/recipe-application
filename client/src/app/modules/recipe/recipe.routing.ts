import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeCreationComponent } from './recipe-creation/recipe-creation.component';

export const routes: Routes = [
  {
    path: '',
    component: RecipesComponent
  },
  {
    path: 'create',
    component: RecipeCreationComponent
  },
  {
    path: ':name',
    component: RecipeDetailComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule {}
