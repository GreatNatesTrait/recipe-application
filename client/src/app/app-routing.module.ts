import { NgModule } from '@angular/core';
import {  RouterModule , Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NoAuthGuard } from '@core/guard/no-auth.guard';
import { HomeComponent } from './modules/home/page/home.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: ContentLayoutComponent,
    //canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: 'home',
        // loadChildren: () =>
        //   import('@modules/home/home.module').then(m => m.HomeModule)
        component: HomeComponent
      },
      {
        path: 'recipes',
        loadChildren: () =>
          import('@modules/recipe/recipe.module').then(m => m.RecipeModule)
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
        component: AuthLayoutComponent,
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
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
   // relativeLinkResolution: 'legacy'
  })],

  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
