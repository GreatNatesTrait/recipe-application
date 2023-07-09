import { RecipeModel } from "./recipe.model";

export interface cacheResponse {
    items: RecipeModel[]
    count: Number
    lastEvaluatedKey?: string;
  }