import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheExerciceComponent } from './fiche-exercice.component';

describe('FicheExerciceComponent', () => {
  let component: FicheExerciceComponent;
  let fixture: ComponentFixture<FicheExerciceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheExerciceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheExerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
