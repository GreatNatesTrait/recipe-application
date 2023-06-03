import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectResolver } from './project-resolver.service';
import { HomeComponent } from './page/home.component';


export const routes: Routes = [
  //    {
  //   path: '',
  //    redirectTo: '',
  //   pathMatch: 'full'
  //  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
