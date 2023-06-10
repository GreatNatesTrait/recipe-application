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
  IngredientMeasurementPairs: any;

  ngOnInit(): void {
    this.combineIngredientsAndMeasurements(
      this.Ingredients,
      this.Measurements
    );
  }

  combineIngredientsAndMeasurements(Ingredients: Object, Measurements: Object) {
    const ingredientKeys = Object.keys(Ingredients);
    const measurementKeys = Object.keys(Measurements);
    ingredientKeys.sort();
    measurementKeys.sort();

    const ngredientMeasurementPairs = [];

    ingredientKeys.forEach((ingredientKey, index) => {
      const measurementKey = measurementKeys[index];
      const Ingredient = Ingredients[ingredientKey];
      const Measurement = Measurements[measurementKey];

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
  }
}
