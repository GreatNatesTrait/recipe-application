import { Injectable } from '@angular/core';
import { Observable, firstValueFrom} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RecipeModel,RecipeAPIresponse } from '@app/shared/models/recipe.model';
import { cacheResponse } from '@app/shared/models/cache.model';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {
  private apiUrl = environment.dynamoAPI;
  private cacheUrl = environment.cacheAPI;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  async shouldInvalidateCache() :Promise<any>{
    let localMetadata;
    let state = await firstValueFrom(this.http.get<any>(`${this.cacheUrl}/cache-state`))
    .then((data)=>localMetadata = data.Items);
console.log(localMetadata)
    let test = localStorage.getItem("cache-metadata");
    if(test){
      let test2 = JSON.parse(test);
    let compare = localMetadata.map(item1 => {
      const item2 = test2.find(item => item.endpoint === item1.endpoint);
      const match = item2 ? item1.response === item2.response : false;
      let output = { ...item1, match };
      console.log(output);
      for (let key in output) {
        if (output.hasOwnProperty(key) && key == 'match' && output[key] == false) {
          console.log("At least one value of match is false.");
          localStorage.removeItem('recipeCache');
        }
      }
    });
    }else{
      localStorage.setItem('cache-metadata',JSON.stringify(localMetadata));
    }
    return state
  }

  // async shouldInvalidateCache() :Promise<any>{
  //   let localMetadata;
  //   if(localStorage.getItem("cache-metadata") !== null){
  //   localMetadata =  JSON.parse(localStorage.getItem('cache-metadata')).Items;
  //   }

  //   if(!localMetadata){
  //     console.log('false');
  //     return;
  //   }

  //   let state = await firstValueFrom(this.http.get<any>(`${this.cacheUrl}/cache-state`)).then((data)=>{
      
  //     if(!localMetadata){
  //     localStorage.setItem('cache-metadata',JSON.stringify(data));
  //     };
  //     data.Items.map(item1 => {
  //       const item2 = localMetadata.find(item => item.endpoint === item1.endpoint);
  //       const match = item2 ? item1.response === item2.response : false;
  //       let output = { ...item1, match };
  //       console.log(output);
  //       if(output.match)
  //     });
  //   }
  //     );
  //   return state
  // }
  

  // getRecipeData(lastEvaluatedKey?): Promise<RecipeAPIresponse> {
  //   let params = new HttpParams();
  //   if (lastEvaluatedKey) {
  //     params = params.set('lastEvaluatedKey', lastEvaluatedKey);
  //   }
  //   return firstValueFrom(
  //     this.http.get<RecipeAPIresponse>(`${this.apiUrl}/recipes`, { params })
  //   );
  // }

  async getRecipeData(lastEvaluatedKey?): Promise<RecipeAPIresponse | cacheResponse> {
    const recipesFromCache = this.cacheService.getRecipesFromCache();
    if (recipesFromCache.length > 0) {
      console.log('using cache');
      return { items: recipesFromCache, count: recipesFromCache.length };
    }


      let params = new HttpParams();
    if (lastEvaluatedKey) {
      params = params.set('lastEvaluatedKey', lastEvaluatedKey);
    }
 

    const response = await firstValueFrom(
     this.http.get<RecipeAPIresponse>(`${this.apiUrl}/recipes`, { params })
    );

    const recipes = response.items;
    this.cacheService.updateRecipeCache(recipes);

    return response;
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
