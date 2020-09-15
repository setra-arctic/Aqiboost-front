import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyntheseVocaleComponent } from './synthese-vocale.component';

describe('SyntheseVocaleComponent', () => {
  let component: SyntheseVocaleComponent;
  let fixture: ComponentFixture<SyntheseVocaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyntheseVocaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyntheseVocaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
