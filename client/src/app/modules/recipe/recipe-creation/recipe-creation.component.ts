import { ChangeDetectionStrategy, Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCreationComponent {
  form: FormGroup;
  inputs: FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['',Validators.required],
      category: ['',Validators.required],
      inputs: this.fb.array([],Validators.required)
    });

    this.inputs = this.form.get('inputs') as FormArray;
  }

  addInput() {
    this.inputs.push(this.fb.control(''));
  }

  removeInput(index: number) {
    this.inputs.removeAt(index);
  }

  submit() {
    // Handle form submission
    console.log(this.form.value);
  }
}
