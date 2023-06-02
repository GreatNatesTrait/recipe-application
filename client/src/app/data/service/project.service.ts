import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Project } from '../schema/project';
import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // constructor(private jsonApiService: JsonApiService) {}

  // getAll(): Observable<Array<Project>> {
  //   return this.jsonApiService.get('/projects');
  // }

  getSingle(id: number): Observable<Project> {
    return this.jsonApiService.get(`/projects/${id}`);
  }
  private apiUrl = 'https://gtkbgjdvoc.execute-api.us-east-1.amazonaws.com/recipe';
  postId = '';
  errorMessage = '';
  constructor(private jsonApiService: JsonApiService, private http: HttpClient) { }

  getRecipeData(): Promise<any[]>{
    return firstValueFrom(this.http.get<any>(this.apiUrl));
  }

  addRecipe(recipe:string): void{
    const headers = new HttpHeaders().set('Content-Type','application/json');
        const body = JSON.stringify({"recipeName": "5534example2@example.com",
        "category": "5543test332",
        "ingredients": "553gg2",
        "instructions": "553ge2",
        "pictures": "553kd2"});
    this.http.post<any>('https://gtkbgjdvoc.execute-api.us-east-1.amazonaws.com/add_recipe', recipe, { headers }).subscribe({
      next: data => {
        this.postId = data.id;
    },
    error: error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
    }
  })
}
}
