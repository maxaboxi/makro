import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoComponent } from './user-info.component';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { StatisticsService } from 'src/app/services/statistics.service';
import { MockStatisticsService } from 'src/app/test-helpers/MockStatisticsService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: StatisticsService, useClass: MockStatisticsService }
      ],
      imports: [NgbModule, RouterTestingModule.withRoutes([]), FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth.fetchUserInfo, calculateBaseExpenditure and statisticsService.getAmountOfPdfCreatedByUser on ngOnInit', () => {
    // Arrange
    const aSpy = spyOn(TestBed.get(AuthService), 'fetchUserInfo').and.returnValue(
      of({ username: '', lang: 'fi', userAddedExpenditure: 1, dailyExpenditure: 1 })
    );
    const cSpy = spyOn(component, 'calculateBaseExpenditure');
    const sSpy = spyOn(TestBed.get(StatisticsService), 'getAmountOfPdfCreatedByUser').and.returnValue(of({ amount: 30 }));

    // Act
    component.ngOnInit();

    expect(component.loading).toBeFalsy();
    expect(component.user.dailyExpenditure).toBe(1);
    expect(component.pdfsCreated).toBe(30);
    expect(aSpy).toHaveBeenCalledTimes(1);
    expect(cSpy).toHaveBeenCalledTimes(1);
    expect(sSpy).toHaveBeenCalledTimes(1);
  });
});
