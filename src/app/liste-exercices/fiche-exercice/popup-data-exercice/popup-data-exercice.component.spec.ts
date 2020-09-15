import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDataExerciceComponent } from './popup-data-exercice.component';

describe('PopupDataExerciceComponent', () => {
  let component: PopupDataExerciceComponent;
  let fixture: ComponentFixture<PopupDataExerciceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupDataExerciceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDataExerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
