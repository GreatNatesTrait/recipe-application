import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './page/about/about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [AboutRoutingModule, SharedModule,   

    HttpClientModule,

    FormsModule,

    ReactiveFormsModule]
})
export class AboutModule {}
