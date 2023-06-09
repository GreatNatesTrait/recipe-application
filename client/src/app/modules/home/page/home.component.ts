import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Inject
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { RecipeDataService } from '@app/data/service/recipe-data.service';
import { Observable, map, startWith, switchMap, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeModel } from '@app/shared/models/recipe.model';
import { CdkTableModule } from '@angular/cdk/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class HomeComponent {
  searchQuery: string;
  searchResults$: Observable<string[]>;
  loading: boolean;
  recipeData: any[];
  recipeNames: any[];
  initialTypeaheadData: any[];
  searchControl = new FormControl();
  filteredData: Observable<string[]>;
  dataControl = new FormControl();
  suggestions: string[] = []; // Store the list of suggestions here
  constructor(
    private http: HttpClient,
    private recipeDataService: RecipeDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.loading = false;
    this.recipeData = [];
  }

  ngOnInit() {
    this.filteredData = this.dataControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this.filterData(value))
    );

    this.dataControl.valueChanges.subscribe(selectedValue => {
      console.log('Selected Item:', selectedValue);
    });
    
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
  }


  filterData(value: string): Observable<string[]> {

    const filteredValue = value.toLowerCase();

    return this.recipeDataService
      .searchRecipes(this.searchQuery)
      .pipe(
      tap(data => {
        this.initialTypeaheadData = data;
      }),
      map(data => data.map(item => item.strMeal.toString())),
      map(data => data.filter(item => item.toLowerCase().includes(filteredValue))),
      tap(filteredData => this.recipeNames = filteredData)
    );
  }

  searchResults(){
  let recipes = this.initialTypeaheadData.filter(obj => this.recipeNames.includes(obj.strMeal));
   this.router.navigate(['search'], {relativeTo: this.activatedRoute, state: {data: {recipes: recipes}}});
  }

  async logPillName(event: MouseEvent) {
    const pillElement = event.target as HTMLElement;
    const pillName = pillElement.textContent;
    console.log('Clicked pill:', pillName);
    let rec = await this.byCat(pillName);
    this.router.navigate(['search'], {relativeTo: this.activatedRoute, state: {data: {recipes: rec}}});
  }
  
  async byCat(cat2): Promise<RecipeModel[]>{
    let cat = await this.recipeDataService.searchRecipesByCategory(cat2);
    console.log(cat);
    return cat
   }
}
