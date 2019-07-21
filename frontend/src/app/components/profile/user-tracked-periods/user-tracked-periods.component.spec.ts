import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTrackedPeriodsComponent } from './user-tracked-periods.component';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { DayService } from 'src/app/services/day.service';
import { MockDayService } from 'src/app/test-helpers/MockDayService';
import { TrackedPeriodService } from 'src/app/services/tracked-period.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MockTrackedPeriodService } from 'src/app/test-helpers/MockTrackedPeriodService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('UserTrackedPeriodsComponent', () => {
  let component: UserTrackedPeriodsComponent;
  let fixture: ComponentFixture<UserTrackedPeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserTrackedPeriodsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: DayService, useClass: MockDayService },
        { provide: TrackedPeriodService, useClass: MockTrackedPeriodService }
      ],
      imports: [NgbModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTrackedPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
