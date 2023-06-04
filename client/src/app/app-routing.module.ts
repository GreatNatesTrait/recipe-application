import { NgModule } from '@angular/core';
import {  RouterModule , Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NoAuthGuard } from '@core/guard/no-auth.guard';
import { HomeComponent } from './modules/home/page/home.component';
import { LoginComponent } from './modules/auth/page/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    //canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: 'home',
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
        loadChildren: () =>
          import('@modules/auth/auth.module').then(m => m.AuthModule)
      },
      {path: 'user',
      loadChildren: () =>
        import('@modules/user/user.module').then(m => m.UserModule)
    }
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],

  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
