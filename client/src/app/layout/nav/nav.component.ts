import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '@core/service/theme.service';
import { environment } from '@env';
import {AuthService } from '@app/core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public version = environment.version;
  currentUser: any = false;
  public isDarkTheme$: Observable<boolean>;


  constructor(private router: Router,private themeService: ThemeService,private authService: AuthService) {}

  ngOnInit() {
   // this.isDarkTheme$ = this.themeService.getDarkTheme();
   this.authService.loggedIn$.subscribe((loggedIn) => {
    this.currentUser = loggedIn;
  });
   this.authService.onUserLoggedIn().subscribe(user => {
    this.currentUser = user;
    console.log(user.attributes.email);
  });
  }

  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  signout(){
    this.authService.signOut().then((user) => {
      console.log(user);
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.log(err);
      //this.loading = false;
    });;
  }

  refreshPage() {
    this.router.navigate(['.'], { queryParams: { refresh: new Date().getTime() } });
  }
}
