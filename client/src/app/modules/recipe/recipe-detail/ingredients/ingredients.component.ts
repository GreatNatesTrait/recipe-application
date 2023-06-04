import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientsComponent implements OnInit {
  Object = Object;
  @Input() Ingredients: Object;
  @Input() Measurements: Object;
  //IngredientMeasurementPairs: Object;
  IngredientMeasurementPairs: any;
  ngOnInit(): void {
    console.log(this.Ingredients);
    console.log(this.Measurements);
    this.combineIngredientsAndMeasurements(
      this.Ingredients,
      this.Measurements
    );
  }

  combineIngredientsAndMeasurements(Ingredients: Object, Measurements: Object) {
    // Extract the keys from both objects into separate arrays
    const ingredientKeys = Object.keys(Ingredients);
    const measurementKeys = Object.keys(Measurements);

    // Sort the arrays of keys to ensure consistent ordering
    ingredientKeys.sort();
    measurementKeys.sort();

    // Create a new object to store the paired ingredient-measurement pairs
    const ngredientMeasurementPairs = [];

    // Iterate over the sorted arrays and pair the ingredients with measurements
    ingredientKeys.forEach((ingredientKey, index) => {
      const measurementKey = measurementKeys[index];
      const pairIndex = index + 1;
      const Ingredient = Ingredients[ingredientKey];
      const Measurement = Measurements[measurementKey];
      // ngredientMeasurementPairs[`Pair${pairIndex}`] = {
      //   Ingredient,
      //   Measurement
      // };
      if(Ingredient == '' || Measurement == ''){
        console.log('skip');
      }else{
      ngredientMeasurementPairs.push({
        Ingredient,
        Measurement
      });
    }
    });

    this.IngredientMeasurementPairs = ngredientMeasurementPairs;
    console.log(this.IngredientMeasurementPairs);
  }
}
