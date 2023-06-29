import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecipeCreationComponent } from './recipe-creation.component';
import { RecipeModule } from '../recipe.module';
describe('RecipeCreationComponent', () => {
  let component: RecipeCreationComponent;
  let fixture: ComponentFixture<RecipeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeCreationComponent ],
      imports: [HttpClientTestingModule,RecipeModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
