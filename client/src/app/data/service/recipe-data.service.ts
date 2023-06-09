import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';
import { RecipeModel } from '@app/shared/models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {

  private apiUrl = environment.dynamoAPI;
  constructor(private http: HttpClient) { }

  getRecipeData(lastEvaluatedKey?): Promise<RecipeModel[]>{
    let params = new HttpParams()
    if(lastEvaluatedKey){
      params = params.set('lastEvaluatedKey', lastEvaluatedKey);
    }
    return firstValueFrom(this.http.get<RecipeModel[]>(`${this.apiUrl}/recipes`, { params }));
    
  }

  searchRecipes(keyword: string): Observable<any[]> {
    const url = `${this.apiUrl}/recipes/search?keyword=${keyword}`;
    return this.http.get<any[]>(url);
  }


  searchRecipesByCategory(keyword: string): Promise<RecipeModel[]>{
    let params = new HttpParams()
 
      params = params.set('keyword', keyword);
    
    return firstValueFrom(this.http.get<RecipeModel[]>(`${this.apiUrl}/recipesByCategory`, { params }));
    
  }


}
