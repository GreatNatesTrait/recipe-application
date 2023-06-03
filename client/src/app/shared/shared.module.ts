import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { ControlMessagesComponent } from './component/control-messages/control-messages.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
//import { SafePipe } from './pipe/safepipe.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [ControlMessagesComponent, SpinnerComponent
   // , SafePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    ControlMessagesComponent,
    SpinnerComponent
    //,
    //SafePipe
  ]
})
export class SharedModule {
 
    
  
}
