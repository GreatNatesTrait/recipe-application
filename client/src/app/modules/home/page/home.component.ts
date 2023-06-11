// import { HttpClient } from '@angular/common/http';
// import {
//   Component
// } from '@angular/core';
// import {
//   animate,
//   state,
//   style,
//   transition,
//   trigger
// } from '@angular/animations';
// import { RecipeDataService } from '@app/data/service/recipe-data.service';
// import { Observable, debounceTime, filter, map, of, startWith, switchMap, tap } from 'rxjs';
// import { FormControl, FormGroup } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RecipeModel } from '@app/shared/models/recipe.model';


// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
//   animations: [
//     trigger('detailExpand', [
//       state('collapsed', style({ height: '0px', minHeight: '0' })),
//       state('expanded', style({ height: '*' })),
//       transition(
//         'expanded <=> collapsed',
//         animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
//       )
//     ])
//   ]
// })
// export class HomeComponent {
//   searchQuery: string;
//   searchResults$: Observable<string[]>;
//   loading: boolean;
//   recipeData: any[];
//   recipeNames: any[];
//   initialTypeaheadData: any[];
//   searchControl = new FormControl();
//   filteredData: Observable<string[]>;
//   dataControl = new FormControl();
//   suggestions: string[] = [];
//   searchForm: FormGroup;
//   searchResult =[];
//   booksName = [];
//   constructor(
//     private recipeDataService: RecipeDataService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//   ) {
//     this.loading = false;
//     this.recipeData = [];
//   }

//   ngOnInit() {
//     this.filteredData = this.dataControl.valueChanges.pipe(
//       startWith(''),
//       switchMap((value) => this.filterData(value))
//     );
//     this.dataControl.valueChanges.subscribe(selectedValue => {
//       console.log('Selected Item:', selectedValue);
//     });
    

//     this.recipeDataService.searchRecipes.filter(name =>  {
//       this.booksName.push(name.name);
//     });
//     this.searchForm = this.fb.group({
//       searchBar : ''
//     })
//     this.onChanges();   
//   }

//   onFormSubmit(event: Event) {
//     event.preventDefault();
//   }


//   filterData(value: string): Observable<string[]> {

//     const filteredValue = value.toLowerCase();
//     return this.recipeDataService
//       .searchRecipes(this.searchQuery)
//       .pipe(
//       tap(data => {
//         this.initialTypeaheadData = data;
//       }),
//       map(data => data.map(item => item.strMeal.toString())),
//       map(data => data.filter(item => item.toLowerCase().includes(filteredValue))),
//       tap(filteredData => this.recipeNames = filteredData)
//     );
//   }

//   searchResults(){
//   let recipes = this.initialTypeaheadData.filter(obj => this.recipeNames.includes(obj.strMeal));
//    this.router.navigate(['search'], {relativeTo: this.activatedRoute, state: {data: {recipes: recipes}}});
//   }

//   async searchCategory(event: MouseEvent) {
//     const pillElement = event.target as HTMLElement;
//     const category = pillElement.textContent;
//     let categoryRecipes = await this.searchByCategory(category);
//     this.router.navigate(['search'], {relativeTo: this.activatedRoute, state: {data: {recipes: categoryRecipes}}});
//   }
  
//   async searchByCategory(category): Promise<RecipeModel[]>{
//     let categoryRecipeData = await this.recipeDataService.searchRecipesByCategory(category);
//     return categoryRecipeData
//    }

//    onChanges(){
//     this.searchForm.get('searchBar').valueChanges.pipe(
//         filter( data => data.trim().length > 0 ),
//         debounceTime(500),
//         switchMap(  (id: string) => {
//           console.log('trim',id.replace(/[\s]/g, '')  )
//        return id ? this.recipeDataService.searchRecipes(id.replace(/[\s]/g,'')) : of([]);
//      })
//     ).subscribe(data =>{
//       console.log(data)
//       this.searchResult = data as Array<{}>; 
//     })
//   }
// }

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RecipeDataService } from '@app/shared/service/recipe-data.service';
//import { Observable, of, startWith, switchMap, tap } from 'rxjs';
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
  recipeData: any[];
  recipeNames: any[];
  initialTypeaheadData: any[];
  searchControl = new FormControl();
  filteredData: Observable<string[]>;
  dataControl = new FormControl();
  suggestions: string[] = [];
  searchForm: FormGroup;
  searchResult: any[];
  booksName: string[];
  filteredData2: any[];
  results: any;
  results$: Observable<any>;
  @ViewChild('timezoneSearch') timezoneSearch: ElementRef;
  constructor(
    private recipeDataService: RecipeDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.loading = false;
    this.recipeData = [];
    this.recipeNames = [];
    this.initialTypeaheadData = [];
    this.searchResult = [];
    this.booksName = [];
  }

  ngOnInit() {
    // this.dataControl.valueChanges.subscribe(selectedValue => {
    //   console.log('Selected Item:', selectedValue);
    //   console.log(this.searchResult)
    // });

    // this.recipeDataService.searchRecipes(this.searchQuery).subscribe(data => {
    //   this.booksName = data.map(name => name.strMeal);
    // });

    this.searchForm = new FormGroup({
       searchBar: new FormControl('')
     });

console.log('idk')
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
  

  searchResults2(selection) {
    //let recipes = this.initialTypeaheadData.filter(obj => this.recipeNames.includes(obj.strMeal));
    let recipes = this.results.filter(obj => obj.strMeal === selection);
    this.router.navigate(['search'], { relativeTo: this.activatedRoute, state: { data: { recipes: recipes } } });
  }

  searchResults(selection) {
    const singleRecipe = this.results.filter(obj => obj.strMeal === selection);
    console.log(singleRecipe);
  this.router.navigate(['/recipes', selection], {relativeTo: this.activatedRoute, state: {data: {recipeData: singleRecipe}}});
  }

  async searchCategory(event: MouseEvent) {
    const pillElement = event.target as HTMLElement;
    const category = pillElement.textContent;
    let categoryRecipes = await this.searchByCategory(category);
    this.router.navigate(['search'], { relativeTo: this.activatedRoute, state: { data: { recipes: categoryRecipes } } });
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
