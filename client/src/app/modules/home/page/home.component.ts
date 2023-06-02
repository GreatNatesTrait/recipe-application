// import { Component } from '@angular/core';
// import { Observable } from 'rxjs';

// import { ProjectService } from '@data/service/project.service';
// import { Project } from '@data/schema/project';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class HomeComponent {
//   projects$: Observable<Project[]> = this.projectService.getAll();

//   constructor(private projectService: ProjectService) {}
// }

import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild,Inject } from '@angular/core';;
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger} from '@angular/animations';
//import {APIService} from '../articles/api.service';
//import {Recipe} from '../shared/models/recipe.model'
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class HomeComponent implements OnInit, AfterViewInit{
  searchTerm = '';

  displayedColumns!: string[];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient
    //,private apiService: APIService
    ) {}

  async ngOnInit(): Promise<void> {
   // let dataa = await this.apiService.getRecipeData();
    //this.displayedColumns = Object.keys(dataa[0]);
   // console.log(dataa);
   // this.dataSource = new MatTableDataSource<any>(dataa);
    // this.http.get<Country[]>('./assets/countries.json')
    //   .subscribe((data: any) => {
    //     this.dataSource = new MatTableDataSource<Country>(data)
    //   });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  filterCountries(searchTerm: string) {
    this.dataSource.filter = searchTerm.trim().toLocaleLowerCase();
    const filterValue = searchTerm;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onMatSortChange() {
    this.dataSource.sort = this.sort;
  }
}


