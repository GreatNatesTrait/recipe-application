import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRecipesComponent {
  @Input() userRecipes;
}
