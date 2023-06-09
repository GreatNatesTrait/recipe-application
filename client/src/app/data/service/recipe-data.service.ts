import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';
import { RecipeModel } from '@app/shared/models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {

  private apiUrl = environment.dynamoAPI;
  constructor(private http: HttpClient) { }

  getRecipeData(): Promise<RecipeModel[]>{
    return firstValueFrom(this.http.get<RecipeModel[]>(`${this.apiUrl}/recipes`));
  }

  searchRecipes(keyword: string): Observable<any[]> {
    const url = `${this.apiUrl}/recipes/search?keyword=${keyword}`;
    return this.http.get<any[]>(url);
  }


}
