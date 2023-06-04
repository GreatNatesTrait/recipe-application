import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService } from '@app/core/service/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '@app/shared/models/iuser.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  signupForm: FormGroup;
  loading: boolean;
  isConfirm: boolean;
  user: IUser;

  constructor(private authService: AuthService, private router: Router, 
    private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) {
      this.signupForm = new FormGroup({
        username: new FormControl('', Validators.required),
        //email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
      this.loading = false;
    this.isConfirm = false;
    this.user = {} as IUser;
    }


    public signUp(): void {
      this.loading = true;
      this.authService.signUp(this.user)
      .then(() => {
        this.loading = false;
        this.isConfirm = true;
      }).catch(() => {
        this.loading = false;
      });
    }
  
    public confirmSignUp(): void {
      this.loading = true;
      this.authService.confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/signIn']);
      }).catch(() => {
        this.loading = false;
      });
    }
}
