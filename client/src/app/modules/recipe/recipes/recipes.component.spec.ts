import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecipesComponent } from './recipes.component';
import { ActivatedRoute } from '@angular/router';
import { RecipeModule } from '../recipe.module';

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecipesComponent],
        imports: [HttpClientTestingModule,RecipeModule],
        providers:
        [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {params: {id: '24fkzrw3487943uf358lovd'}}
            }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
