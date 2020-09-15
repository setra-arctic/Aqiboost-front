import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionParentsComponent } from './inscription-parents.component';

describe('InscriptionParentsComponent', () => {
  let component: InscriptionParentsComponent;
  let fixture: ComponentFixture<InscriptionParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscriptionParentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscriptionParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
