import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsComponent } from './meals.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockDayService } from 'src/app/test-helpers/MockDayService';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { DayService } from 'src/app/services/day.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { FormsModule } from '@angular/forms';

describe('MealsComponent', () => {
  let component: MealsComponent;
  let fixture: ComponentFixture<MealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MealsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: DayService, useClass: MockDayService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService }
      ],
      imports: [NgbModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
