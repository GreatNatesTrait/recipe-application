import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectResolver } from './project-resolver.service';
import { HomeComponent } from './page/home.component';
import { ProjectDetailsComponent } from './page/project-details/project-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'recipes',
        component: ProjectDetailsComponent
      }
    ]
  },
 // },
  // {
  //   //path: 'projects/:id',
  //   path: 'recipes',
  //   component: ProjectDetailsComponent,
  //   resolve: {
  //     project: ProjectResolver
  //   }
  // }
];
// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: '/auth/login',
//     pathMatch: 'full'
//   },
//   {
//     path: '',
//     children: [
//       {
//         path: 'login',
//         component: LoginComponent
//       },
//       {
//         path: 'register',
//         component: RegisterComponent
//       }
//     ]
//   },
//   // {
//   //   path: '',
//   //   children: [
//   //     {
//   //       path: 'login',
//   //       component: LoginComponent
//   //     },
//   //     {
//   //       path: 'register',
//   //       component: RegisterComponent
//   //     }
//   //   ]
//   // }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
