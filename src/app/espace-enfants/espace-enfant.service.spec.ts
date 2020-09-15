import { TestBed } from '@angular/core/testing';

import { EspaceEnfantService } from './espace-enfant.service';

describe('EspaceEnfantService', () => {
  let service: EspaceEnfantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspaceEnfantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
