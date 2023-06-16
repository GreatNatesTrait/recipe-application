export interface ILogObject {
    timestamp: string;
    message: string;
    source?: boolean;
    level: number;
    ip?: string;
  }