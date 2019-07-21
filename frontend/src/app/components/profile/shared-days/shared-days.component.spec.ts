import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDaysComponent } from './shared-days.component';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockDayService } from 'src/app/test-helpers/MockDayService';
import { DayService } from 'src/app/services/day.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SharedDaysComponent', () => {
  let component: SharedDaysComponent;
  let fixture: ComponentFixture<SharedDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharedDaysComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DayService, useClass: MockDayService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
