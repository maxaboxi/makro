import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQaComponent } from './user-qa.component';

describe('UserQaComponent', () => {
  let component: UserQaComponent;
  let fixture: ComponentFixture<UserQaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
