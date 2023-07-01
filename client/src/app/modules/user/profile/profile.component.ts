import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { AuthService } from '@app/shared/service/auth/auth.service';
import { UserService } from '@app/shared/service/user/user.service';
import { RecipeDataService } from '@app/shared/service/data/recipe-data.service';

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
  userFavs = [];
  userFavData = [];
  userRecipeData = [];
  userRecipes? = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dataService: RecipeDataService,
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
    this.user = await this.authService.getUser();

    this.userFavs = await this.userService.getUserFavs(this.user);
    this.userRecipes = await this.userService.getUserRecipes(this.user);
    console.log(this.userRecipes);
    console.log(this.userRecipes);
    await Promise.all(
      this.userFavs.map(async (ele) => {
        const data = await this.dataService.getRecipeByID(ele);
        this.userFavData.push(data[0]);
      })
    );

    await Promise.all(
      this.userRecipes.map(async (ele) => {
        const data = await this.dataService.getRecipeByID(ele);
        this.userRecipeData.push(data[0]);
      })
    );

    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }
  // user2 = {
  //   username: 'John Doe',
  //   attributes: {
  //     email: 'johndoe@example.com'
  //   },
  //   bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  // };
  // isEditable = false;

  // toggleEdit(): void {
  //   this.isEditable = !this.isEditable;
  // }

  // saveChanges(): void {
  //   // Perform save logic here
  //   this.isEditable = false;
  // }

  getFavData() {}
}
