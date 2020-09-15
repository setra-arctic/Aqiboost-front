import { TestBed } from '@angular/core/testing';

import { ListeMatricesService } from './liste-matrices.service';

describe('ListeMatricesService', () => {
  let service: ListeMatricesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeMatricesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
