import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '@app/data/schema/project';
import { ProjectService } from '@app/data/service/project.service';
import { Recipe } from '@app/data/schema/recipe';



@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  project$: Observable<Project>;

  constructor(private dataService: ProjectService, private router: Router, private activatedRoute: ActivatedRoute) {}

  recipeData : Recipe[] = [];
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
