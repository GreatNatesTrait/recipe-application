import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IUser } from '../models/iuser.model';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { AuthService } from '@core/service/auth.service';
import { environment } from 'environments/environment';


class RequestOptions {
  params?: any;
  headers?: HttpHeaders;
  observe?: string;
  responseType?: string;
  reportProgress?: boolean;
}

/**
 * this api service should be used only when user is authenticated
 */
@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  private apiBaseUrl = environment.API_URL;

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) {}

  /**
   * Performs a request with `get` http method.
   * @param url the url
   * @param options the request options
   */
  public get(url: string, options?: RequestOptions, expectUnauth?: boolean): Observable<any> {
    return this.http
      .get(`${this.apiBaseUrl}/${url}`, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err, expectUnauth)));
  }

  /**
   * Performs a request with `post` http method.
   * @param url the url
   * @param body the body
   * @param options the request options
   */
  public post(url: string, body: any, options?: RequestOptions, expectUnauth?: boolean): Observable<any> {
    return this.http
      .post(`${this.apiBaseUrl}/${url}`, body, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err, expectUnauth)));
  }

  /**
   * Performs a request with `put` http method.
   * @param url the url
   * @param body the body
   * @param options the request options
   */
  public put(url: string, body?: any, options?: RequestOptions): Observable<any> {
    return this.http
      .put(`${this.apiBaseUrl}/${url}`, body, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err)));
  }

  /**
   * Performs a request with `patch` http method.
   * @param url the url
   * @param body the body
   * @param options the request options
   */
  public patch(url: string, body?: any, options?: RequestOptions): Observable<any> {
    return this.http
      .patch(`${this.apiBaseUrl}/${url}`, body, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err)));
  }

  /**
   * Performs a request with `delete` http method.
   * @param url the url
   * @param options the request options
   */
  public delete(url: string, options?: RequestOptions): Observable<any> {
    return this.http
      .delete(`${this.apiBaseUrl}/${url}`, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err)));
  }

  /**
   * catches the auth error
   * @param error the error response
   */
  catchError(error: HttpErrorResponse, expectUnauth?: boolean): Observable<Response> {
    if (error.status === 401) {
      if (!expectUnauth) {
        this.toastr.error(error.error.message, '');
        this.authService.signOut();
      }
    } else if (error.status === 500) {
      this.toastr.error('Internal server error. Please try again later!', '');
    } else if (error.status === 0) {
      this.toastr.error('API is offline/down', '');
    } else {
      this.toastr.error(error.error.message, '');
    }

    return throwError(error);
  }

  /**
   * Request options.
   * @param options - request options
   * cleans the parms and add auth headers
   */
  private requestOptions(options: RequestOptions = {}): any {
    options = options || new RequestOptions();
    options.headers = options.headers || new HttpHeaders();

    if (options.params) {
      Object.keys(options.params).forEach((key) => {
        const value = options.params[key];
        if (_.isNil(value) || value.length === 0) {
          delete options.params[key];
        } else if (_.isArray(value)) {
          options.params[key] = value.join(',');
        } else if (_.isDate(value)) {
          options.params[key] = value.toISOString();
        }
      });
    }

    const accessToken = this.authService.getToken();
    if (accessToken) {
      options.headers = options.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return options;
  }
}