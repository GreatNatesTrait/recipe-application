import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { catchError, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {
  private apiUrl = environment.dynamoAPI;
  

  constructor(private http: HttpClient) {}

  getRecipeData(lastEvaluatedKey?): Promise<RecipeModel[]> {
    let params = new HttpParams();
    if (lastEvaluatedKey) {
      params = params.set('lastEvaluatedKey', lastEvaluatedKey);
    }
    return firstValueFrom(
      this.http.get<RecipeModel[]>(`${this.apiUrl}/recipes`, { params })
    );
  }

  // searchRecipes(keyword: string): Observable<any[]> {
  //   const url = `${this.apiUrl}/recipes/search?keyword=${keyword}`;
  //   return this.http.get<any[]>(url);
  // }

  searchRecipes(keyword: string): Promise<RecipeModel[]> {
    const url = `${this.apiUrl}/recipes/search?keyword=${keyword}`;
    return firstValueFrom(this.http.get<RecipeModel[]>(url));
  }

  searchRecipesByCategory(keyword: string): Promise<RecipeModel[]> {
    let params = new HttpParams();
    params = params.set('keyword', keyword);

    return firstValueFrom(
      this.http.get<RecipeModel[]>(`${this.apiUrl}/recipesByCategory`, {
        params
      })
    );
  }
}
