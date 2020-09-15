import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqiboostMenuComponent } from './aqiboost-menu.component';

describe('AqiboostMenuComponent', () => {
  let component: AqiboostMenuComponent;
  let fixture: ComponentFixture<AqiboostMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqiboostMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqiboostMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
