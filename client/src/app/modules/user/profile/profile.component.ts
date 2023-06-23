import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { AuthService } from '@app/shared/service/auth/auth.service';
import { UserService } from '@app/shared/service/user/user.service';

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
    private userService: UserService,
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
    this.userFavs = this.userService.getUserFavs(this.user);
    this.userRecipes = this.userService.getUserRecipes(this.user);
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }
  user2 = {
    username: 'John Doe',
    attributes: {
      email: 'johndoe@example.com'
    },
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  };
  isEditable = false;

  toggleEdit(): void {
    this.isEditable = !this.isEditable;
  }

  saveChanges(): void {
    // Perform save logic here
    this.isEditable = false;
  }
}
