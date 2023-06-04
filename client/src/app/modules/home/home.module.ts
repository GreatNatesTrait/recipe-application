import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './page/home.component';
import { SafePipe } from '@app/shared/pipe/safepipe.pipe';
import { HomeRoutingModule } from './home.routing';

@NgModule({
  declarations: [HomeComponent, SafePipe],
  imports: [SharedModule, HomeRoutingModule],
  exports: [SafePipe],
  providers: [SafePipe]
})
export class HomeModule {}
