import { TestBed } from '@angular/core/testing';

import { FicheUserService } from './fiche-user.service';

describe('FicheUserService', () => {
  let service: FicheUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
