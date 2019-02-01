import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnswersComponent } from './admin-answers.component';

describe('AdminAnswersComponent', () => {
  let component: AdminAnswersComponent;
  let fixture: ComponentFixture<AdminAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
