import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerApiService {
  private apiUrl = environment.loggerAPI;

  constructor(private http: HttpClient) { }

  writeLogToS3(logMessage){
    const url = `${this.apiUrl}/logs`;
    return firstValueFrom(this.http.put<any>(url, logMessage));
  }
}
