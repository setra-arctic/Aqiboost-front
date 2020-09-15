import { TestBed } from '@angular/core/testing';

import { ExempleMatriceService } from './exemple-matrice.service';

describe('ExempleMatriceService', () => {
  let service: ExempleMatriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExempleMatriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
