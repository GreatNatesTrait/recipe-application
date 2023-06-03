import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Recipe } from '../schema/recipe';
import { JsonApiService } from './json-api.service';
import { dynamo_api_url } from '../../../../../server/env_vars';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // constructor(private jsonApiService: JsonApiService) {}

  // getAll(): Observable<Array<Project>> {
  //   return this.jsonApiService.get('/projects');
  // }

  getSingle(id: number): Observable<any> {
    return this.jsonApiService.get(`/projects/${id}`);
  }
  private apiUrl = dynamo_api_url;
  constructor(private jsonApiService: JsonApiService, private http: HttpClient) { }

  getRecipeData(): Promise<Recipe[]>{
    return firstValueFrom(this.http.get<Recipe[]>(`${this.apiUrl}/recipes`));
  }


}
