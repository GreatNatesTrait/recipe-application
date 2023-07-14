import { Injectable } from '@angular/core';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_KEY = 'recipeCache';

  private cacheUrl = environment.cacheAPI;

  constructor(private http: HttpClient) {}
  invalidCache(): void{
    
  }

  getRecipesFromCache(): RecipeModel[] {
    const cache = this.getCache();
    return Object.values(cache);
  }

  updateRecipeCache(recipes: RecipeModel[]): void {
    const cache = this.getCache();
    recipes.forEach(recipe => {
      cache[recipe.idMeal] = recipe;
    });
    this.saveCache(cache);
  }

  private getCache(): { [key: string]: RecipeModel } {
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : {};
  }

  private saveCache(cache: { [key: string]: RecipeModel }): void {
    //let cachee = this.http.get(`${this.cacheUrl}\cache-state`);
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
  }
}
