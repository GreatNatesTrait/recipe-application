import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectResolver } from './project-resolver.service';
import { HomeComponent } from './page/home.component';


import { AuthLayoutComponent } from '@app/layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  //    {
  //   path: '',
  //    redirectTo: '',
  //   pathMatch: 'full'
  //  },
  {path: 'dv',
         component: AuthLayoutComponent}]
  // {
  //   path: '',
  //   redirectTo: '/dashboard/home',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'home',
  //       component: HomeComponent
  //     },
  //     {
  //       path: 'recipes',
  //       component: ProjectDetailsComponent
  //     },
  //     {
  //       path: 'recipe/:name',
  //       component: ProjectItemComponent
  //     }
  //   ]
  // }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
