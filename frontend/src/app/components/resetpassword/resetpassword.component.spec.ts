import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordComponent } from './resetpassword.component';
import { AuthService } from 'src/app/services/auth.service';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('ResetpasswordComponent', () => {
  let component: ResetpasswordComponent;
  let fixture: ComponentFixture<ResetpasswordComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetpasswordComponent, MockTranslatePipe],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService }
      ],
      imports: [FormsModule, RouterTestingModule.withRoutes([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  shouldNotCallAuthService('', '', '', '');
  shouldNotCallAuthService('a', '', '', '');
  shouldNotCallAuthService('', 'b', '', '');
  shouldNotCallAuthService('', '', 'c', '');
  shouldNotCallAuthService('', '', '', 'd');
  shouldNotCallAuthService('aa', 'bb', 'cc', 'dd');
  function shouldNotCallAuthService(email: string, password: string, passwordAgain: string, passwordResetToken: string) {
    it('should call flashMessageService.show and not call authService.resetPassword', () => {
      // Arrange
      const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
      const authSpy = spyOn(TestBed.get(AuthService), 'resetPassword');
      component.user.email = email;
      component.user.password = password;
      component.user.passwordResetToken = passwordResetToken;
      component.passwordAgain = passwordAgain;

      // Act
      component.submit();

      // Assert
      expect(flashSpy).toHaveBeenCalledTimes(1);
      expect(authSpy).not.toHaveBeenCalled();
    });
  }

  it('should call authService.resetPassword, flashMessagesService.show but not router.navigate when success is false', () => {
    // Arrange
    const authSpy = spyOn(TestBed.get(AuthService), 'resetPassword').and.returnValue(of({ success: false, message: 'abc' }));
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    component.user.email = 'email';
    component.user.password = 'password';
    component.user.passwordResetToken = 'passwordResetToken';
    component.passwordAgain = 'password';

    // Act
    component.submit();

    // Assert
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should call authService.resetPassword, flashMessagesService.show and router.navigate', () => {
    // Arrange
    const authSpy = spyOn(TestBed.get(AuthService), 'resetPassword').and.returnValue(of({ success: true, message: 'abc' }));
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    component.user.email = 'email';
    component.user.password = 'password';
    component.user.passwordResetToken = 'passwordResetToken';
    component.passwordAgain = 'password';

    // Act
    component.submit();

    // Assert
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });
});
