import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedDaysComponent } from './saved-days.component';

describe('SavedDaysComponent', () => {
  let component: SavedDaysComponent;
  let fixture: ComponentFixture<SavedDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
