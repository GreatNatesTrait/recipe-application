import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoggerApiService {
  private apiUrl = environment.loggerAPI;

  constructor(private http: HttpClient) {}

  writeLogToS3(body) {
    //create log timestamp
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');
    const logTimestamp = `${timestamp}.${milliseconds}`;

    const log = {
      timestamp: logTimestamp,
      message: body,
      source: this.getFunctionName()
    };

    // Check if adding the new log will exceed the local storage threshold
    const MAX_LOCAL_STORAGE_SIZE = 3 * 1024;
    const currentLocalStorageSize = JSON.stringify(localStorage).length;
    const newLogSize = JSON.stringify(body).length;

    if (currentLocalStorageSize + newLogSize > MAX_LOCAL_STORAGE_SIZE) {
      // Local storage will exceed the threshold, upload logs to S3
      console.log('threshold reached');
      this.uploadLogsToS3();
      localStorage.removeItem('logs');
    }

    // Add the new log to local storage
    const logs = localStorage.getItem('logs');
    const updatedLogs = logs ? JSON.parse(logs) : [];
    updatedLogs.push(log);
    localStorage.setItem('logs', JSON.stringify(updatedLogs));
  }

  private getFunctionName(): string {
    const stackTrace = new Error().stack;
    const functionName = stackTrace.match(/at (\S+)/g)?.[1];
    return functionName ? functionName.slice(3) : 'Unknown Function';
  }

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
