import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RecipeModule } from '../recipe.module';
import { RecipeDetailComponent } from './recipe-detail.component';
import { ActivatedRoute } from '@angular/router';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecipeDetailComponent],
        imports: [RecipeModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: {
                  get: () => {
                        return 'Salted Caramel Cheescake';
                    }
                }
              }
            }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDetailComponent);
    TestBed.inject(ActivatedRoute);
    history.pushState({ data: {recipeData: [
          {
              "strSource": "http://www.janespatisserie.com/2015/11/09/no-bake-salted-caramel-cheesecake/",
              "strImageSource": "",
              "strCategory": "Dessert",
              "strTags": "",
              "idMeal": "52833",
              "strCreativeCommonsConfirmed": "",
              "strMealThumb": "https://www.themealdb.com/images/media/meals/xqrwyr1511133646.jpg",
              "strYoutube": "https://www.youtube.com/watch?v=q5dQp3qpmI4",
              "strIngredient": {
                  "strIngredient1": "Digestive Biscuits",
                  "strIngredient3": "Butter",
                  "strIngredient10": "Caramel Sauce",
                  "strIngredient2": "Pretzels",
                  "strIngredient20": "",
                  "strIngredient5": "Vanilla Extract",
                  "strIngredient12": "Pretzels",
                  "strIngredient4": "Cream Cheese",
                  "strIngredient11": "Toffee Popcorn",
                  "strIngredient7": "Caramel",
                  "strIngredient14": "",
                  "strIngredient6": "Icing Sugar",
                  "strIngredient13": "",
                  "strIngredient9": "Double Cream",
                  "strIngredient16": "",
                  "strIngredient8": "Sea Salt",
                  "strIngredient15": "",
                  "strIngredient18": "",
                  "strIngredient17": "",
                  "strIngredient19": ""
              },
              "dateModified": "",
              "strDrinkAlternate": "",
              "strArea": "American",
              "strMeal": "Salted Caramel Cheescake",
              "strMeasure": {
                  "strMeasure12": "Top",
                  "strMeasure13": "",
                  "strMeasure10": "drizzle",
                  "strMeasure11": "Top",
                  "strMeasure20": "",
                  "strMeasure9": "300ml ",
                  "strMeasure7": "150g",
                  "strMeasure8": "1tsp",
                  "strMeasure5": "1tsp",
                  "strMeasure6": "100g ",
                  "strMeasure3": "135g",
                  "strMeasure4": "450g",
                  "strMeasure1": "250g",
                  "strMeasure18": "",
                  "strMeasure2": "75g",
                  "strMeasure19": "",
                  "strMeasure16": "",
                  "strMeasure17": "",
                  "strMeasure14": "",
                  "strMeasure15": ""
              },
              "strInstructions": "1) Blitz the biscuits and the pretzels in a food processor and mix the biscuits with the melted butter. Spread on the bottom of an 8â€³/20cm Deep Springform Tin and press down firmly. Leave to set in the fridge whilst you make the rest![BREAK][BREAK]2) Using an electric mixer, I use my KitchenAid with the whisk attachment, whisk together the cream cheese, vanilla, and icing sugar until smooth and then add the caramel and whisk again until smooth and lump free â€“ this could take a couple of minutes, I whisk it at half speed so not too quick or slow![BREAK][BREAK]3) Pour in the double cream & Salt flakes and continue to whisk for a couple of minutes until its very thick and mousse like (I mix it on a medium speed, level 6/10) â€“ Now this could take up to 5 minutes depending on your mixer, but you seriously have to stick at it â€“ it will hold itself completely when finished mixing (like a meringue does!) If you donâ€™t mix it enough it will not set well enough, but donâ€™t get impatient and whisk it really quick because thatâ€™ll make it split! Spread over the biscuit base and leave to set in the fridge overnight.[BREAK][BREAK]4) Remove the Cheesecake from the tin carefully and decorate the cheesecake â€“ I drizzled over some of the spare caramel, and then some Toffee Popcorn and more Pretzels!"
          }
      ]
    }
  },'');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
