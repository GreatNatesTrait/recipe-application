import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '@app/shared/service/user/user.service';
import { UserRecipesComponent } from './user-recipes.component';
import { ActivatedRoute } from '@angular/router';

describe('UserRecipesComponent', () => {
  let component: UserRecipesComponent;
  let fixture: ComponentFixture<UserRecipesComponent>;
  const mockUserService = { UserService: jest.fn()};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRecipesComponent ],
      providers:
      [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {id: '24fkzrw3487943uf358lovd'}}
          }
        },
          { provide: UserService, useValue: mockUserService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
