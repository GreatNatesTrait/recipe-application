import { ChangeDetectionStrategy, Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { UserService } from '@app/shared/service/user.service';
import { Observable,from } from 'rxjs';
import { IUser } from '@app/shared/models/iuser.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent {
  loading: boolean;
  email:string;
  user$: Observable<any>; 
  user: IUser;
  form: FormGroup;
  isProfileEmpty: boolean;
  isLoading: boolean;
  apiAction: string;
  isUserReceived: boolean = false;
  constructor(private authService: AuthService,  private formBuilder: FormBuilder,
    private toastr: ToastrService,private userService: UserService) {
    this.loading = false;
    this.user = {} as IUser;
    this.user$ = from(this.authService.getUser());
    this.user$.subscribe(() => {
      this.isUserReceived = true; // Toggle the boolean when user is received
    });
    this.form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      currentaddress: new FormControl(''),
      previousaddress: new FormControl('')
    });
    this.isProfileEmpty = true;
    this.isLoading = true;
    this.apiAction = '';
  }

  ngOnInit(): void {

  }

  public update(): void {
    this.loading = true;

    this.authService.updateUser(this.user)
    .then(() => {
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  createProfile(): void {
    if (Object.values(this.form.value).every((val) => val === '')) {
      this.toastr.warning('Atleast 1 value must be filled to create profile');
    } else {
      this.isLoading = true;
      this.apiAction = 'create';
      this.userService.createProfile(this.form.value).subscribe(() => {
        this.isProfileEmpty = false;
        this.isLoading = false;
      });
    }
  }

  /**
   * Update user profile in API
   */
  updateProfile(): void {
    if (Object.values(this.form.value).every((val) => val === '')) {
      this.toastr.warning('Empty profile cannot be updated');
    } else {
      this.isLoading = true;
      this.apiAction = 'update';
      this.userService.updateProfile(this.form.value).subscribe(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Delete user profile in API
   */
  deleteProfile(): void {
    this.isLoading = true;
    this.apiAction = 'delete';
    this.userService.deleteProfile().subscribe(() => {
      this.isProfileEmpty = true;
      this.form.patchValue({
        name: '',
        email: '',
        phone: '',
        currentaddress: '',
        previousaddress: '',
      });
      this.isLoading = false;
    });
  }

}
