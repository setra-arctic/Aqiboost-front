import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExempleMatriceComponent } from './exemple-matrice.component';

describe('ExempleMatriceComponent', () => {
  let component: ExempleMatriceComponent;
  let fixture: ComponentFixture<ExempleMatriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExempleMatriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExempleMatriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
