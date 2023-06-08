import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env';
import { Amplify } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });
  }

  public ngOnInit(): void {
  }
}
