import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsComponent } from './ingredients.component';

describe('IngredientsComponent', () => {
  let component: IngredientsComponent;
  let fixture: ComponentFixture<IngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsComponent);
    component = fixture.componentInstance;
    component.Ingredients = {
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
  };
  component.Measurements = {
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
};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
