import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '@core/service/theme.service';
import { environment } from '@env';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public version = environment.version;
  currentUser: any = false;
  public isDarkTheme$: Observable<boolean>;
  isAuthenticated: boolean;

  constructor(private router: Router,private themeService: ThemeService, private authService: AuthService) {}

  async ngOnInit() {
  this.isAuthenticated = await this.authService.checkAuthStatus()
  }

 

async signout(){
  await this.authService.signout().then(()=> this.isAuthenticated = false)
}

  
  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }
}
