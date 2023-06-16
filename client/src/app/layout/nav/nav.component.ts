import { Component, OnInit } from '@angular/core';
import { environment } from '@env';
import { AuthService } from '@app/shared/service/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public version = environment.version;
  currentUser: any = false;
  isAuthenticated: boolean;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isAuthenticated = await this.authService.checkAuthStatus();
  }

  async signout() {
    await this.authService.signout().then(() => (this.isAuthenticated = false));
  }
}
