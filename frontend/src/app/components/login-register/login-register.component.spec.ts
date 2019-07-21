import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterComponent } from './login-register.component';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { AuthService } from 'src/app/services/auth.service';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';

describe('LoginRegisterComponent', () => {
  let component: LoginRegisterComponent;
  let fixture: ComponentFixture<LoginRegisterComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginRegisterComponent, MockTranslatePipe],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AddedFoodsService, useClass: MockAddedFoodsService }
      ],
      imports: [FormsModule, RouterTestingModule.withRoutes([]), NgbModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  shouldNotCallAuthServiceLogin('', '');
  shouldNotCallAuthServiceLogin('a', '');
  shouldNotCallAuthServiceLogin('', 'b');
  function shouldNotCallAuthServiceLogin(username: string, password: string) {
    it('should call flashMessageService.show and not call authService.login', () => {
      // Arrange
      const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
      const authSpy = spyOn(TestBed.get(AuthService), 'login');
      component.loginUser.password = password;
      component.loginUser.username = username;

      // Act
      component.login();

      // Assert
      expect(flashSpy).toHaveBeenCalledTimes(1);
      expect(authSpy).not.toHaveBeenCalled();
    });
  }

  it('should call flashMessageService.show, authService.login but not router.navigate when success is false', () => {
    // Arrange
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const authSpy = spyOn(TestBed.get(AuthService), 'login').and.returnValue(of({}));
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    component.loginUser.username = 'a';
    component.loginUser.password = 'b';

    // Act
    component.login();

    // Assert
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should call flashMessageService.show, authService.login and router.navigate when success is true', () => {
    // Arrange
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const authSpy = spyOn(TestBed.get(AuthService), 'login').and.returnValue(of({ token: 'adss', user: { lang: 'fi' } }));
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    const addedFoodsSpy = spyOn(TestBed.get(AddedFoodsService), 'setMealsFromLocalStorage');
    const translateSpy = spyOn(TestBed.get(TranslateService), 'use');
    component.loginUser.username = 'a';
    component.loginUser.password = 'b';

    // Act
    component.login();

    // Assert
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledTimes(1);
    expect(addedFoodsSpy).toHaveBeenCalledTimes(1);
    expect(translateSpy).toHaveBeenCalledWith('fi');
  });

  shouldNotCallAuthServiceRegister('', '', '');
  shouldNotCallAuthServiceRegister('a', '', '');
  shouldNotCallAuthServiceRegister('', 'b', '');
  shouldNotCallAuthServiceRegister('', '', 'c');
  shouldNotCallAuthServiceRegister('a', 'b', '');
  shouldNotCallAuthServiceRegister('a', '', 'b');
  function shouldNotCallAuthServiceRegister(email: string, password: string, username: string) {
    it('should call flashMessageService.show and not call authService.register', () => {
      // Arrange
      const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
      const authSpy = spyOn(TestBed.get(AuthService), 'register');
      component.registerUser.email = email;
      component.registerUser.password = password;
      component.registerUser.username = username;

      // Act
      component.register();

      // Assert
      expect(flashSpy).toHaveBeenCalledTimes(1);
      expect(authSpy).not.toHaveBeenCalled();
    });
  }

  it('should call flashMessageService.show, authService.register when success is false', () => {
    // Arrange
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const authSpy = spyOn(TestBed.get(AuthService), 'register').and.returnValue(of({}));
    component.registerUser.username = 'a';
    component.registerUser.password = 'b';
    component.passwordAgain = 'b';

    // Act
    component.register();

    // Assert
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(component.registerActive).toBeFalsy();
  });

  it('should call flashMessageService.show, authService.register when success is true', () => {
    // Arrange
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const authSpy = spyOn(TestBed.get(AuthService), 'register').and.returnValue(of({ success: true }));
    component.registerUser.username = 'a';
    component.registerUser.password = 'b';
    component.passwordAgain = 'b';

    // Act
    component.register();

    // Assert
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(component.registerActive).toBeTruthy();
  });

  it('should call flashMessageService.show and not call authService.forgotPassword', () => {
    // Arrange
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const authSpy = spyOn(TestBed.get(AuthService), 'forgotPassword');
    component.loginUser.username = '';

    // Act
    component.forgotPassword();

    // Assert
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).not.toHaveBeenCalled();
  });

  it('should call flashMessageService.show and authService.forgotPassword', () => {
    // Arrange
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const authSpy = spyOn(TestBed.get(AuthService), 'forgotPassword').and.returnValue(of({ success: false }));
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    component.loginUser.username = 'username';

    // Act
    component.forgotPassword();

    // Assert
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith('username');
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should call flashMessageService.show and authService.forgotPassword', () => {
    // Arrange
    const flashSpy = spyOn(TestBed.get(FlashMessagesService), 'show');
    const authSpy = spyOn(TestBed.get(AuthService), 'forgotPassword').and.returnValue(of({ success: true }));
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    component.loginUser.username = 'username';

    // Act
    component.forgotPassword();

    // Assert
    expect(flashSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith('username');
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });
});
