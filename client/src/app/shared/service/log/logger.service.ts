import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogLevel } from '@app/shared/models/log-level.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private apiUrl = environment.loggerAPI;
  logLevel: LogLevel = new LogLevel();

  constructor(private http: HttpClient) {}

  info(msg: string): void {
    this.logWith(this.logLevel.Info, msg);
  }

  warn(msg: string): void {
    this.logWith(this.logLevel.Warn, msg);
  }

  error(msg: string): void {
    this.logWith(this.logLevel.Error, msg); 
  }

  private logWith(level: any, msg: string): any {

    let log = {time: this.timestamp(), level:level, message: msg};

    if (level <= this.logLevel.Error) {
      switch (level) {
        case this.logLevel.None:
          console.log(msg);
        case this.logLevel.Info:
          console.info('%c' + msg, 'color: #6495ED');
        case this.logLevel.Warn:
          console.warn('%c' + msg, 'color: #FF8C00');
        case this.logLevel.Error:
          console.error('%c' + msg, 'color: #DC143C');
        default:
          console.debug(msg);
          this.uploadLogsToS3(JSON.stringify(log))
      }
    }
  }

  timestamp(){
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');
    const logTimestamp = `${timestamp}.${milliseconds}`;

    return logTimestamp;

  }

  uploadLogsToS3(logs) {
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
