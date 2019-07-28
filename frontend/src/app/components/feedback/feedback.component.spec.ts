import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComponent } from './feedback.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MockFeedbackService } from 'src/app/test-helpers/MockFeedbackService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { FormsModule } from '@angular/forms';
import { Feedback } from 'src/app/models/Feedback';
import { of } from 'rxjs';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: FeedbackService, useClass: MockFeedbackService }
      ],
      imports: [NgbModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user and fetch feedbacks on init', () => {
    // Arrange
    const user = { username: 'user', uuid: '123213', lang: 'fi', userAddedExpenditure: 1, dailyExpenditure: 1 };
    const feedBacks: Feedback[] = [{ feedbackBody: 'abc' }, { feedbackBody: 'cba' }];
    const fSpy = spyOn(TestBed.get(FeedbackService), 'getAllFeedbacks').and.returnValue(of(feedBacks));

    // Act
    component.ngOnInit();

    // Assert
    expect(fSpy).toHaveBeenCalledTimes(1);
    expect(component.user).toEqual(user);
    expect(component.feedbacks).toEqual(feedBacks);
    expect(component.feedbacks.length).toBe(2);
  });

  it('should submit feedback and reset form and fetch all feedbacks when feedback saved succesfully', () => {
    // Arrange
    const feedback: Feedback = { feedbackBody: 'aabbcc', username: 'user', userId: '' };
    const feedBacks: Feedback[] = [{ feedbackBody: 'abc' }, { feedbackBody: 'cba' }, feedback];
    const fAll = spyOn(TestBed.get(FeedbackService), 'getAllFeedbacks').and.returnValue(of(feedBacks));
    const fSubmit = spyOn(TestBed.get(FeedbackService), 'submitFeedback').and.returnValue(of({ success: true }));
    component.feedback = feedback;

    // Act
    component.ngOnInit();
    component.submitFeedback();

    // Assert
    expect(fAll).toHaveBeenCalledTimes(2);
    expect(fSubmit).toHaveBeenCalledTimes(1);
    expect(fSubmit).toHaveBeenCalledWith({ feedbackBody: 'aabbcc', username: 'user', userId: '123213' });
    expect(component.feedbacks).toEqual(feedBacks);
    expect(component.feedbacks.length).toBe(3);
    expect(component.feedback).toEqual({ username: 'Nimetön', feedbackBody: '', userId: '' });
  });

  it('should submit feedback and not reset form and not fetch all feedbacks when feedback is not saved succesfully', () => {
    // Arrange
    const feedback: Feedback = { feedbackBody: 'aabbcc', username: 'user', userId: '' };
    const feedBacks: Feedback[] = [{ feedbackBody: 'abc' }, { feedbackBody: 'cba' }];
    const fAll = spyOn(TestBed.get(FeedbackService), 'getAllFeedbacks').and.returnValue(of(feedBacks));
    const fSubmit = spyOn(TestBed.get(FeedbackService), 'submitFeedback').and.returnValue(of({ success: false }));
    component.feedback = feedback;

    // Act
    component.ngOnInit();
    component.submitFeedback();

    // Assert
    expect(fAll).toHaveBeenCalledTimes(1);
    expect(fSubmit).toHaveBeenCalledTimes(1);
    expect(fSubmit).toHaveBeenCalledWith({ feedbackBody: 'aabbcc', username: 'user', userId: '123213' });
    expect(component.feedbacks).toEqual(feedBacks);
    expect(component.feedbacks.length).toBe(2);
    expect(component.feedback).toEqual({ feedbackBody: 'aabbcc', username: 'user', userId: '' });
  });
});
