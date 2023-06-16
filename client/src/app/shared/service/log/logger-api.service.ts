import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerApiService {
  private apiUrl = environment.loggerAPI;

  constructor(private http: HttpClient) {}

  
  uploadLogsToS3() {
    const logs = localStorage.getItem('logs');

    if (logs) {
      const options = {
        method: 'PUT',
        url: `${this.apiUrl}/logs`,
        body: JSON.parse(logs)
      };

      this.http
        .request(options.method, options.url, {
          body: options.body
        })
        .subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }
}
