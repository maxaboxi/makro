import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataListComponent } from './data-list.component';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('DataListComponent', () => {
  let component: DataListComponent;
  let fixture: ComponentFixture<DataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataListComponent, MockTranslatePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
