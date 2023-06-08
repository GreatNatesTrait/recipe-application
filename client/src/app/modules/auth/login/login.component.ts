import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@app/shared/models/iuser.model';
import { Auth } from 'aws-amplify';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  user: IUser;
  verifingMe = false;
  constructor(private router: Router, private authService: AuthService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  ngOnInit(): void {
  }

  async login(email:string, password:string){
    await this.authService.login(email, password)
  }

 
}
