import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '@app/core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/user/profile',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: ProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
