import { ChangeDetectionStrategy, Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { RecipeDataService } from '@app/shared/service/recipe-data.service';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCreationComponent {
  form: FormGroup;
  ingredients: FormArray;
  measurements: FormArray;
  instructions: FormArray;

  constructor(private fb: FormBuilder, private recipeDataService: RecipeDataService) { 
 }

  


  ngOnInit() {
    this.form = this.fb.group({
      idMeal: '1',
      name: ['',Validators.required],
      category: ['',Validators.required],
      ingredients: this.fb.array([],Validators.required),
      measurements: this.fb.array([],Validators.required),
      instructions: this.fb.array([],Validators.required)
    });

    this.ingredients = this.form.get('ingredients') as FormArray;
    this.measurements = this.form.get('measurements') as FormArray;
    this.instructions = this.form.get('instructions') as FormArray;
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
    // Handle form submission
    console.log(this.form.value);
    this.createRecipe();
  }

  getIngredientNameControlName(index: number): string {
    return `ingredients.${index}`;
  }
  
  getIngredientQuantityControlName(index: number): string {
    return `measurements.${index}`;
  }
  
  
async createRecipe(){
  const result = this.recipeDataService.createRecipe(this.form.value);
  console.log(result);
}

  // updateDropdownOptions() {
  //   if (this.radioControl.value === '1') {
  //     this.dropdownOptions = ['a', 'b', 'c'];
  //   } else if (this.radioControl.value === '2') {
  //     this.dropdownOptions = ['d', 'e', 'f'];
  //   }
  // }
}
