import { TestBed } from '@angular/core/testing';

import { PopupDataExerciceService } from './popup-data-exercice.service';

describe('PopupDataExerciceService', () => {
  let service: PopupDataExerciceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupDataExerciceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
