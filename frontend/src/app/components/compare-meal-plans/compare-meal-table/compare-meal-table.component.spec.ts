import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareMealTableComponent } from './compare-meal-table.component';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { FormsModule } from '@angular/forms';

describe('CompareMealTableComponent', () => {
  let component: CompareMealTableComponent;
  let fixture: ComponentFixture<CompareMealTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompareMealTableComponent, MockTranslatePipe],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareMealTableComponent);
    component = fixture.componentInstance;
    component.meal = {
      name: 'meal',
      foods: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
