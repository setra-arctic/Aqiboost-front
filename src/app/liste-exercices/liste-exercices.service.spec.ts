import { TestBed } from '@angular/core/testing';

import { ListeExercicesService } from './liste-exercices.service';

describe('ListeExercicesService', () => {
  let service: ListeExercicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeExercicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
