import { TestBed } from '@angular/core/testing';

import { InscriptionParentsService } from './inscription-parents.service';

describe('InscriptionParentsService', () => {
  let service: InscriptionParentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscriptionParentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
