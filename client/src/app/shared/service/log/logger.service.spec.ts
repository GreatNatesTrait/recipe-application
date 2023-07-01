import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
