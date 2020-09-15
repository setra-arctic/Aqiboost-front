import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqiboostDialogComponent } from './aqiboost-dialog.component';

describe('AqiboostDialogComponent', () => {
  let component: AqiboostDialogComponent;
  let fixture: ComponentFixture<AqiboostDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqiboostDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqiboostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
