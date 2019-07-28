import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsComponent } from './statistics.component';
import { StatisticsService } from 'src/app/services/statistics.service';
import { MockStatisticsService } from 'src/app/test-helpers/MockStatisticsService';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { of } from 'rxjs';
import { Statistics } from 'src/app/models/Statistics';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: StatisticsService, useClass: MockStatisticsService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch stats', () => {
    // Arrange
    const stats: Statistics = {
      users: 10,
      userLoggedInTheLastSevenDays: 20,
      foods: 230,
      days: 11,
      pdf: 2401,
      maleCount: 400,
      femaleCount: 90,
      averageAge: 22.2,
      averageHeight: 199,
      averageWeight: 32,
      topFoods: []
    };
    const spy = spyOn(TestBed.get(StatisticsService), 'getStats').and.returnValue(of(stats));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.loading).toBeFalsy();
    expect(component.statistics).toEqual(stats);
  });
});
