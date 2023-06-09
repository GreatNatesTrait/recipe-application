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
  user: IUser;
  form: FormGroup;
  isProfileEmpty: boolean;
  isLoading: boolean;
  apiAction: string;
  isAuthenticated : boolean;
  // Usage example


  
  constructor(  private formBuilder: FormBuilder,private authService: AuthService, private changeDetectorRef: ChangeDetectorRef ) {
    this.loading = false;
    this.user = {} as IUser;
    this.form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      currentaddress: new FormControl(''),
      previousaddress: new FormControl('')
    });
    this.isProfileEmpty = true;
    this.apiAction = '';
  }
  
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.isAuthenticated = await this.authService.checkAuthStatus();
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }



// ...

// Set custom attributes for a user
async setCustomAttributes() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user);
    const { sub } = user.attributes;
    let favs = [52957,52988,52893,52878,52896];
    let strings = JSON.stringify(favs);
    // if (sub !== userId) {
    //   throw new Error('Invalid user ID');
    // }


    //const userId = '84482458-20d1-70de-c6b1-1d02575c0330';
    const updateUserAttributes = {
      "custom:Favorites": strings
    // ...
  };

    await Auth.updateUserAttributes(user, updateUserAttributes);
    console.log('Custom attributes updated successfully');
  } catch (error) {
    console.error('Error updating custom attributes:', error);
  }
}





}
