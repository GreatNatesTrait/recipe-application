import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { AuthService } from '@app/shared/service/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  loading: boolean;
  email: string;
  user: any;
  form: FormGroup;
  isLoading: boolean;
  isAuthenticated: boolean;
  userFavs: any;
  userRecipes:any;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.loading = false;
    this.form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      currentaddress: new FormControl(''),
      previousaddress: new FormControl('')
    });
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.isAuthenticated = await this.authService.checkAuthStatus();
    this.user = await this.authService.getUser();
    console.log(this.user)
    this.userFavs = JSON.parse(this.user.attributes['custom:favorites']);
    this.userRecipes = JSON.parse(this.user.attributes['custom:UserRecipes']);
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }
}
