import { TestBed } from '@angular/core/testing';

import { AqiboostEmailService } from './aqiboost-email.service';

describe('AqiboostEmailService', () => {
  let service: AqiboostEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AqiboostEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
