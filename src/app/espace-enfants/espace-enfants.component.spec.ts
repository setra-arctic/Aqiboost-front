import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EspaceEnfantsComponent } from './espace-enfants.component';

describe('EspaceEnfantsComponent', () => {
  let component: EspaceEnfantsComponent;
  let fixture: ComponentFixture<EspaceEnfantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceEnfantsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceEnfantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
