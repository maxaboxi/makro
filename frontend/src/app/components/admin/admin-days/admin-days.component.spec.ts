import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDaysComponent } from './admin-days.component';

describe('AdminDaysComponent', () => {
  let component: AdminDaysComponent;
  let fixture: ComponentFixture<AdminDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
