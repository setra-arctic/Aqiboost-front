import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMatriceComponent } from './ajout-matrice.component';

describe('AjoutMatriceComponent', () => {
  let component: AjoutMatriceComponent;
  let fixture: ComponentFixture<AjoutMatriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutMatriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutMatriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
