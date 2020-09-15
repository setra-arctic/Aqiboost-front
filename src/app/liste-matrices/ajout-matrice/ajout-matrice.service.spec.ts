import { TestBed } from '@angular/core/testing';

import { AjoutMatriceService } from './ajout-matrice.service';

describe('AjoutMatriceService', () => {
  let service: AjoutMatriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AjoutMatriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
