import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagUserComponent } from './tag-user.component';

describe('TagUserComponent', () => {
  let component: TagUserComponent;
  let fixture: ComponentFixture<TagUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
