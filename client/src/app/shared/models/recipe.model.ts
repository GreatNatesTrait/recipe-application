export interface RecipeModel {
    strSource?: string;
    strImageSource?: string;
    strCategory: string;
    strTags?: string;
    idMeal: string;
    strCreativeCommonsConfirmed?: string;
    strMealThumb?: string;
    strYoutube?: string;
    strIngredient: Array<any> | Object;
    dateModified?: string;
    strDrinkAlternate?: string;
    strArea?: string;
    strMeal: string;
    strMeasure: Array<any> | Object;
    strInstructions: string;
  }