import { Injectable } from '@angular/core';
import { Observable, firstValueFrom} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RecipeModel,RecipeAPIresponse } from '@app/shared/models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {
  private apiUrl = environment.dynamoAPI;

  constructor(private http: HttpClient) {}

  // getRecipeData(lastEvaluatedKey?): Promise<RecipeAPIresponse> {
  //   let params = new HttpParams();
  //   if (lastEvaluatedKey) {
  //     params = params.set('lastEvaluatedKey', lastEvaluatedKey);
  //   }
  //   return firstValueFrom(
  //     this.http.get<RecipeAPIresponse>(`${this.apiUrl}/recipes`, { params })
  //   );
  // }

  getRecipeData(lastEvaluatedKey?): Promise<RecipeAPIresponse> {
    if (environment.localData) {
      // Load data from local JSON file
      return firstValueFrom(
        this.http.get<RecipeAPIresponse>(environment.localData)
      );
    } else {
      // Make request to API
      let params = new HttpParams();
      if (lastEvaluatedKey) {
        params = params.set('lastEvaluatedKey', lastEvaluatedKey);
      }
      return firstValueFrom(
        this.http.get<RecipeAPIresponse>(`${this.apiUrl}/recipes`, { params })
      );
    }
  }
  

  searchRecipes(keyword: string): Observable<any[]> {
    const url = `${this.apiUrl}/recipes/search?keyword=${keyword}`;
    return this.http.get<any[]>(url);
  }

  getRecipeByID(id): Promise<RecipeModel[]> {
    const url = `${this.apiUrl}/recipe?id=${id}`;
    console.log(url);
    return firstValueFrom(this.http.get<RecipeModel[]>(url));
  }

  deleteRecipe(id): Promise<any> {
    const url = `${this.apiUrl}/recipe?id=${id}`;
    console.log(url);
    return firstValueFrom(this.http.delete<any>(url));
  }

  createRecipe(body): Promise<any> {
    const url = `${this.apiUrl}/create-recipe`;
    return firstValueFrom(this.http.put<RecipeModel>(url, body));
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

  getExistingPKs(): Promise<any[]> {
    const url = `${this.apiUrl}/existing-primary-keys`;
    return firstValueFrom(this.http.get<any[]>(url));
  }
}
