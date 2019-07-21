import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedDaysComponent } from './saved-days.component';
import { AddedFoodsService } from 'src/app/services/added-foods.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockAddedFoodsService } from 'src/app/test-helpers/MockAddedFoodsService';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { DayService } from 'src/app/services/day.service';
import { MockDayService } from 'src/app/test-helpers/MockDayService';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { FormsModule } from '@angular/forms';

describe('SavedDaysComponent', () => {
  let component: SavedDaysComponent;
  let fixture: ComponentFixture<SavedDaysComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SavedDaysComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AddedFoodsService, useClass: MockAddedFoodsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DayService, useClass: MockDayService }
      ],
      imports: [NgbModule, RouterTestingModule.withRoutes([]), FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
