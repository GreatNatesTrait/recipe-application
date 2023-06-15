import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';
import { RecipeDataService } from '@app/shared/service/recipe-data.service';
import { RecipeModel } from '@app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCreationComponent implements OnInit{
  form: FormGroup;
  ingredients: FormArray;
  measurements: FormArray;
  instructions: FormArray;
  existingPKs: [];
  recipe2Add = <RecipeModel>{};

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
      instructions: this.fb.array([], Validators.required)
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
  }

  getIngredientNameControlName(index: number): string {
    return `ingredients.${index}`;
  }

  getIngredientQuantityControlName(index: number): string {
    return `measurements.${index}`;
  }

  async createRecipe(recipe: RecipeModel) {
    const result = this.recipeDataService.createRecipe(recipe);
    console.log(result);
  }

  // updateDropdownOptions() {
  //   if (this.radioControl.value === '1') {
  //     this.dropdownOptions = ['a', 'b', 'c'];
  //   } else if (this.radioControl.value === '2') {
  //     this.dropdownOptions = ['d', 'e', 'f'];
  //   }
  // }

  async getExistingMeals(){
    this.existingPKs = await this.recipeDataService.getExistingPKs();
  }

  smallestNumNotaPK(){

  }

  mapFormToRecipeModel(){
    this.recipe2Add.strCategory = this.form.value.category;
    this.recipe2Add.strMeal = this.form.value.name;
    this.recipe2Add.strIngredient = this.form.value.ingredients;
    this.recipe2Add.strInstructions = this.form.value.instructions;
    this.recipe2Add.strMeasure = this.form.value.measurements;
  }
}
