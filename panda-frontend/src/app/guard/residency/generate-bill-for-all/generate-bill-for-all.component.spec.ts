import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBillForAllComponent } from './generate-bill-for-all.component';

describe('GenerateBillForAllComponent', () => {
  let component: GenerateBillForAllComponent;
  let fixture: ComponentFixture<GenerateBillForAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBillForAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBillForAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
