import { TestBed } from '@angular/core/testing';

import { StripeScriptService } from './stripe-script.service';

describe('StripeScriptService', () => {
  let service: StripeScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
