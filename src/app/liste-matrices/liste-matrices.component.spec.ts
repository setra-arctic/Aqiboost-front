import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMatricesComponent } from './liste-matrices.component';

describe('ListeMatricesComponent', () => {
  let component: ListeMatricesComponent;
  let fixture: ComponentFixture<ListeMatricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeMatricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeMatricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
