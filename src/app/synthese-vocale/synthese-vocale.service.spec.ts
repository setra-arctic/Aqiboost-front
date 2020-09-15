import { TestBed } from '@angular/core/testing';

import { SyntheseVocaleService } from './synthese-vocale.service';

describe('SyntheseVocaleService', () => {
  let service: SyntheseVocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyntheseVocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
