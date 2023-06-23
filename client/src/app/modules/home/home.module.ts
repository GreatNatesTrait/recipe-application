import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './page/home.component';
import { HomeRoutingModule } from './home.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  declarations: [HomeComponent,  SearchResultsComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ]
})
export class HomeModule {}
