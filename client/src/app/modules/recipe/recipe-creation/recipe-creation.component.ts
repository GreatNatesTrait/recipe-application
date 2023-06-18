import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';
import { RecipeDataService } from '@app/shared/service/data/recipe-data.service';
import { RecipeModel } from '@app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCreationComponent implements OnInit {
  form: FormGroup;
  ingredients: FormArray;
  measurements: FormArray;
  instructions: FormArray;
  existingPKs: [] | number[];
  recipe2Add = <RecipeModel>{};
  pk;

  constructor(
    private fb: FormBuilder,
    private recipeDataService: RecipeDataService
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      ingredients: this.fb.array([], Validators.required),
      measurements: this.fb.array([], Validators.required),
      instructions: this.fb.array([], Validators.required),
      image: [''],
      youtube: ['']
    });

    this.ingredients = this.form.get('ingredients') as FormArray;
    this.measurements = this.form.get('measurements') as FormArray;
    this.instructions = this.form.get('instructions') as FormArray;

    await this.getExistingMeals();
  }

  addIngredient() {
    this.ingredients.push(this.fb.control(''));
    this.measurements.push(this.fb.control(''));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
    this.measurements.removeAt(index);
  }

  addInstruction() {
    this.instructions.push(this.fb.control(''));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  submit() {
    console.log(this.form.value);
    this.mapFormToRecipeModel();
    this.createRecipe(this.recipe2Add);
    console.log(this.existingPKs);
  }

  getIngredientNameControlName(index: number): string {
    return `ingredients.${index}`;
  }

  getIngredientQuantityControlName(index: number): string {
    return `measurements.${index}`;
  }

  async createRecipe(recipe: RecipeModel) {
    try{
    const result = this.recipeDataService.createRecipe(recipe);
    console.log(result);
    alert('Recipe successfully created')
    }catch (error) {
      console.error('Error creating recipe:', error);
    }
  }

  async getExistingMeals() {
    const result: any[] = [];
    await this.recipeDataService
      .getExistingPKs()
      .then((primaryKeys) =>
        primaryKeys.forEach((el) => result.push(parseInt(el.idMeal)))
      );

    this.pk = this.smallestNumNotaPK(result).toString();
  }

  smallestNumNotaPK(arr) {
    const numSet: Set<number> = new Set(arr);
    let smallestMissing = 1;
    while (numSet.has(smallestMissing)) {
      smallestMissing++;
    }
    return smallestMissing;
  }

  mapFormToRecipeModel() {
    this.recipe2Add.idMeal = this.pk;
    this.recipe2Add.strCategory = this.form.value.category;
    this.recipe2Add.strMeal = this.form.value.name;
    this.recipe2Add.strIngredient = this.prepareArrays(
      'Ingredient',
      this.form.value.ingredients
    );
    this.recipe2Add.strInstructions = this.prepareArrays(
      'Instructions',
      this.form.value.instructions
    );
    this.recipe2Add.strMeasure = this.prepareArrays(
      'Measure',
      this.form.value.measurements
    );
    this.recipe2Add.strMealThumb = this.form.value.image;
    this.recipe2Add.strYoutube = this.form.value.youtube;
  }

  prepareArrays(caseValue, arr: []) {
    let tmpObj = {};
    let result;
    switch (caseValue) {
      case 'Ingredient':
        for (let i = 1; i <= arr.length; i++) {
          tmpObj[`strIngredient${i}`] = arr[i - 1];
        }
        result = tmpObj;
        break;
      case 'Measure':
        for (let i = 1; i <= arr.length; i++) {
          tmpObj[`strMeasure${i}`] = arr[i - 1];
        }
        result = tmpObj;
        break;
      case 'Instructions':
        result = arr.join('[BREAK]');
        break;
    }
    return result;
  }
}
