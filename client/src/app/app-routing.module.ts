import { NgModule } from '@angular/core';
import {  RouterModule , Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('@modules/home/home.module').then(m => m.HomeModule)
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
      {path: 'user',
      loadChildren: () =>
        import('@modules/user/user.module').then(m => m.UserModule)
    }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@modules/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'enabled'})],

  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
