import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '@data/schema/project';
import { ProjectService } from '@app/data/service/project.service';
//import { APIService } from './api.service';


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html'
})
export class ProjectDetailsComponent implements OnInit {
  project$: Observable<Project>;

  constructor(private dataService: ProjectService, private router: Router, private activatedRoute: ActivatedRoute) {}

  recipeData : any[] = [];
  loading = true;

  async ngOnInit(): Promise<void> {
    this.recipeData = await this.dataService.getRecipeData();
    console.log(this.recipeData);
    this.loading = false;
  }

  navigateToDynamicComponent(pathParam: string) {
    const singleRecipe = this.recipeData.filter(el => el.Recipe_Name === pathParam);
    this.router.navigate(['recipe/', pathParam], {relativeTo: this.activatedRoute, state: {data: {recipeData: singleRecipe}}});
  }
}
