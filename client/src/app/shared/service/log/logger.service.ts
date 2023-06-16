import { Injectable } from '@angular/core';
import { LogLevel } from '@app/shared/models/log-level.model';
import { LoggerApiService } from '@app/shared/service/log/logger-api.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logLevel: LogLevel = new LogLevel();

  constructor( private logAPIService: LoggerApiService,) {}

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

    let log = {level:level, message: msg};

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
          this.storeLogInLocalStorage(log)
      }
    }
  }

  storeLogInLocalStorage(log){
    //create log timestamp
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');
    const logTimestamp = `${timestamp}.${milliseconds}`;

    log.timestamp = logTimestamp;

    // Check if adding the new log will exceed the local storage threshold
    const MAX_LOCAL_STORAGE_SIZE = 3 * 1024;
    const currentLocalStorageSize = JSON.stringify(localStorage).length;
    const newLogSize = JSON.stringify(log).length;

    if (currentLocalStorageSize + newLogSize > MAX_LOCAL_STORAGE_SIZE) {
      // Local storage will exceed the threshold, upload logs to S3
      console.log('threshold reached');
      this.logAPIService.uploadLogsToS3();
      localStorage.removeItem('logs');
    }

    // Add the new log to local storage
    const logs = localStorage.getItem('logs');
    const updatedLogs = logs ? JSON.parse(logs) : [];
    updatedLogs.push(log);
    localStorage.setItem('logs', JSON.stringify(updatedLogs));
  }
}
