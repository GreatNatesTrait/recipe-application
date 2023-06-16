import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerApiService {
  private apiUrl = environment.loggerAPI;

  constructor(private http: HttpClient) {}

  writeLogToS3v2(body: string): Promise<any> {
    const url = `${this.apiUrl}/logs`;
    const encoder = new TextEncoder();
    const encodedBody = encoder.encode(body);
    const contentLength = encodedBody.length;

    const headers = {
      'Content-Length': contentLength.toString()
    };
    return firstValueFrom(this.http.put<any>(url, encodedBody, { headers }));
  }

   writeLogToS3(body) {
    const options = {
      method: 'PUT',
      url: 'https://5olenhixzi.execute-api.us-east-1.amazonaws.com/logs',
      // headers: {
      //   'Content-Type': 'text/plain'
      // },
      //responseType: 'text' // Specify the response type as 'text' to get the response body as a string
    };
  
    this.http.request(options.method, options.url, {
      //headers: options.headers,
      body: body,
      //responseType: options.responseType
    }).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  writeLogToS39(body){
  
      const url = 'https://5olenhixzi.execute-api.us-east-1.amazonaws.com/logs';

    //   const encoder = new TextEncoder();
    // const encodedBody = encoder.encode(body);
    // const contentLength = encodedBody.length;
    //   const headers = new HttpHeaders({
    //     'Content-Type': 'text/plain',
    //     'Content-Length': contentLength.toString()
    //   });
  
      const postData2 = '"{test log}"';
      const postData = body;
  
      this.http.put(url, postData, 
        { 
          //headers,
           responseType: 'text' }
        )
        .subscribe(
          response => {
            console.log(response);
          },
          error => {
            console.error(error);
          }
        );
    
  }
}
