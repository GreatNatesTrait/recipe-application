import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user.routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FavoritesComponent } from './profile/favorites/favorites.component';
import { UserRecipesComponent } from './profile/user-recipes/user-recipes.component';


@NgModule({
  declarations: [
    ProfileComponent,
    FavoritesComponent,
    UserRecipesComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule
  ],
  providers:[]
})
export class UserModule { }
