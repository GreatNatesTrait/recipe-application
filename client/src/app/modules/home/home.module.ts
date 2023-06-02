import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './page/home.component';
import { ProjectItemComponent } from './page/project-item/project-item.component';
import { ProjectDetailsComponent } from './page/project-details/project-details.component';

import { HomeRoutingModule } from './home.routing';

@NgModule({
  declarations: [HomeComponent, ProjectItemComponent, ProjectDetailsComponent],
  imports: [SharedModule, HomeRoutingModule],
  exports: [],
  providers: []
})
export class HomeModule {}
