import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UknListComponent } from './ukn-list.component';

describe('UknListComponent', () => {
  let component: UknListComponent;
  let fixture: ComponentFixture<UknListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UknListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UknListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
