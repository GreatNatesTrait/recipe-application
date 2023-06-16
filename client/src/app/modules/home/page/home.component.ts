import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RecipeDataService } from '@app/shared/service/data/recipe-data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { Observable, catchError, debounceTime, filter, fromEvent, map, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})

export class HomeComponent implements OnInit, AfterViewInit {
  searchQuery: string;
  searchResults$: Observable<string[]>;
  loading: boolean;
  dataControl = new FormControl();
  searchForm: FormGroup;
  results: any;
  results$: Observable<any>;
  isLoading: boolean;
  @ViewChild('timezoneSearch') timezoneSearch: ElementRef;

  constructor(
    private recipeDataService: RecipeDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
       searchBar: new FormControl('')
     });
  }

  ngAfterViewInit() {    
    this.results$ = fromEvent(this.timezoneSearch.nativeElement, 'input').pipe(
      debounceTime(500),
      map((e: InputEvent) =>(e.target as HTMLInputElement).value),
      switchMap(value => {
        if (value !== '') {
          return this.recipeDataService.searchRecipes(value);
        } else {
          return of([]);
        }
      }),
      tap(res => {
        if (this.searchQuery !== null) {
          this.results = res;
        }
      }),
      catchError(error => {
        console.error(error);
        return throwError(error);
      })
    );
    this.results$.subscribe(result => console.log(result));
  };


  onFormSubmit(event: Event) {
    event.preventDefault();
  }

  searchResults(selection) {
    const singleRecipe = this.results.filter(obj => obj.strMeal === selection);
    console.log(singleRecipe);
  this.router.navigate(['/recipes', selection], {relativeTo: this.activatedRoute, state: {data: {recipeData: singleRecipe}}});
  }

  async searchCategory(event: MouseEvent) {
    this.isLoading = true;
    const pillElement = event.target as HTMLElement;
    const category = pillElement.textContent;
    let categoryRecipes = await this.searchByCategory(category);
    this.router.navigate(['search'], { relativeTo: this.activatedRoute, state: { data: { recipes: categoryRecipes } } });
    this.isLoading = false;
  }

  async searchByCategory(category): Promise<RecipeModel[]> {
    let categoryRecipeData = await this.recipeDataService.searchRecipesByCategory(category);
    return categoryRecipeData;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value;
    this.searchResults(selectedValue)
  }
}
