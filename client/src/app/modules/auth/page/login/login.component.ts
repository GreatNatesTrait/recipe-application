import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import { IUser } from '@app/shared/models/iuser.model';
import { UserService } from '@app/shared/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  user: IUser;
  verifingMe = false;
  constructor(private router: Router,
              private authService: AuthService,private userService: UserService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.verifingMe = true;
      this.userService.getMe(true).subscribe(
        () => {
          this.router.navigate(['/user/profile']);
        },
        () => {
          this.verifingMe = false;
        }
      );
    }
  }

  public signIn(): void {
    this.loading = true;
    this.authService.signIn(this.user)
    .then((user) => {
      console.log(user);
      this.router.navigate(['/home']);
    }).catch(() => {
      this.loading = false;
    });
    
  }

  refreshPage() {
    this.router.navigate(['.'], { queryParams: { refresh: new Date().getTime() } });
  }
}
