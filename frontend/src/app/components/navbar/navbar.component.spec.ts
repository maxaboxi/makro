import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { AuthService } from 'src/app/services/auth.service';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, MockTranslatePipe],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: ConnectionService, useClass: MockConnectionService }
      ],
      imports: [RouterTestingModule.withRoutes([]), NgbModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.lang = 'fi';
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set lang, call auth.getUserInfo and check if logged in and admin', () => {
    // Arrange
    const spy = spyOn(TestBed.get(AuthService), 'getUserInfo');
    component.isAdmin = true;
    component.isLoggedIn = true;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.lang).toBe('fi');
    expect(component.isAdmin).toBeFalsy();
    expect(component.isLoggedIn).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle logout correctly', () => {
    // Arrange
    const afs = TestBed.get(AddedFoodsService);
    const aSpy = spyOn(TestBed.get(AuthService), 'logout');
    const spy1 = spyOn(afs, 'resetTotals');
    const spy2 = spyOn(afs, 'setMealsFromLocalStorage');
    const spy3 = spyOn(afs._openedSavedMeal, 'next');
    const spy4 = spyOn(afs._previousMealsSavedToLocalStorage, 'next');
    const spy5 = spyOn(afs._mealsEdited, 'next');
    const rSpy = spyOn(TestBed.get(Router), 'navigate').and.callFake(() => {});

    // Act
    component.logout();

    // Assert
    expect(aSpy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledWith(false);
    expect(spy4).toHaveBeenCalledWith(false);
    expect(spy5).toHaveBeenCalledWith(false);
    expect(rSpy).toHaveBeenCalled();
  });

  it('should change language to en', () => {
    // Arrange
    const spy = spyOn(TestBed.get(TranslateService), 'use');
    const authSpy = spyOn(TestBed.get(AuthService), 'updateLanguage');

    // Act
    component.changeLanguage();

    // Assert
    expect(spy).toHaveBeenCalledWith('en');
    expect(component.lang).toBe('en');
    expect(authSpy).not.toHaveBeenCalled();
  });

  it('should change language to en and call auth.updateLanguage', () => {
    // Arrange
    const spy = spyOn(TestBed.get(TranslateService), 'use');
    const authSpy = spyOn(TestBed.get(AuthService), 'updateLanguage');
    component.lang = 'fi';
    component.isLoggedIn = true;

    // Act
    component.changeLanguage();

    // Assert
    expect(spy).toHaveBeenCalledWith('en');
    expect(component.lang).toBe('en');
    expect(authSpy).toHaveBeenCalledWith('en');
  });
});
