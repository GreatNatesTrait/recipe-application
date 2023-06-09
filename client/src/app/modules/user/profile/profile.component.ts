import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { IUser } from '@app/shared/models/iuser.model';
import { AuthService } from '@app/core/service/auth.service';
import { Auth } from 'aws-amplify';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent {
  loading: boolean;
  email:string;
  //user: IUser;
  username: any;
  user: any;
  form: FormGroup;
  isProfileEmpty: boolean;
  isLoading: boolean;
  apiAction: string;
  isAuthenticated : boolean;
  // Usage example
userFavs:any;

  
  constructor(  private formBuilder: FormBuilder,private authService: AuthService, private changeDetectorRef: ChangeDetectorRef ) {
    this.loading = false;
    //this.user = {} as IUser;
    this.form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      currentaddress: new FormControl(''),
      previousaddress: new FormControl('')
    });
    this.isProfileEmpty = true;
    this.apiAction = '';
    this.username = '';
  }
  
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.isAuthenticated = await this.authService.checkAuthStatus();
    
    
    //console.log(this.authService.getUser())
    this.user = await this.authService.getUser();
    this.username = this.user.username;
    this.userFavs = JSON.parse(this.user.attributes['custom:favorites']);
    console.log(this.userFavs)
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
    
  }

}
