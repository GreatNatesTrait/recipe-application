import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { UserService } from '@app/shared/service/user/user.service';
@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRecipesComponent {
  @Input() user;
  @Input() userRecipes;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,

  ) {}

  navigateToRecipeDetails(meal) {
    const singleRecipe = this.userRecipes.filter(
      (el) => el.strMeal === meal
    );
    this.router.navigate(['/recipes', meal], {
      relativeTo: this.activatedRoute,
      state: { data: { recipeData: singleRecipe } }
    });
  }

  async deleteRecipe(id?){
    console.log(this.user)
    await this.userService.deleteRecipe(id);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/user/profile']);
    });
  }
}
