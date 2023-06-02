import { NgModule } from '@angular/core';
import {  RouterModule , Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NoAuthGuard } from '@core/guard/no-auth.guard';

const routes: Routes = [

  {
    path: '',
    component: ContentLayoutComponent,
    //canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'about',
        loadChildren: () =>
          import('@modules/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('@modules/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@modules/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  // {
  //   path: 'auth',
  //   component: AuthLayoutComponent,
  //   loadChildren: () =>
  //     import('@modules/auth/auth.module').then(m => m.AuthModule)
  // },
  // Fallback when no prior routes is matched
  //{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
