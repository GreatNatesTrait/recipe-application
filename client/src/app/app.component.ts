import { Component, OnInit } from '@angular/core';
import { environment } from '@env';
import { Amplify } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });
  }

  public ngOnInit(): void {
  }
}
