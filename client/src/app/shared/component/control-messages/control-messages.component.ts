import { Component, Input } from '@angular/core';
import { UntypedFormControl, AbstractControl } from '@angular/forms';
import { ValidationService } from '../../service/validation.service';

@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.scss']
})
export class ControlMessagesComponent {
  @Input() control: UntypedFormControl | AbstractControl;
  @Input() labelName?: string;


  get errorMessage(): string {

    // console.log('Control:', this.control);
    // console.log('Errors:', this.control.errors);
  
    for (const propertyName in this.control.errors) {
      //console.log('PropertyName:', propertyName);
      if (
        this.control.errors.hasOwnProperty(propertyName) && this.control.touched
      ) {
        const errorMessage = ValidationService.getValidationErrorMessage(
          propertyName,
          this.control.errors[propertyName],
          this.labelName
        );
        //console.log('ErrorMessage:', errorMessage);
        return errorMessage;
      }
    }
  
    return undefined;
  }
  
}
