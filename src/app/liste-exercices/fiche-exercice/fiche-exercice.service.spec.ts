import { TestBed } from '@angular/core/testing';

import { FicheExerciceService } from './fiche-exercice.service';

describe('FicheExerciceService', () => {
  let service: FicheExerciceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheExerciceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
