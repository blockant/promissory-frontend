import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSpinnerComponent } from './mat-spinner.component';

describe('MatSpinnerComponent', () => {
  let component: MatSpinnerComponent;
  let fixture: ComponentFixture<MatSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
