import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMealsComponent } from './shared-meals.component';
import { MockAuthService } from 'src/app/test-helpers/MockAuthService';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { SharedMealsService } from 'src/app/services/shared-meals.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { MockConnectionService } from 'src/app/test-helpers/MockConnectionService';
import { MockSharedMealsService } from 'src/app/test-helpers/MockSharedMealsService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('SharedMealsComponent', () => {
  let component: SharedMealsComponent;
  let fixture: ComponentFixture<SharedMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharedMealsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: SharedMealsService, useClass: MockSharedMealsService },
        { provide: ConnectionService, useClass: MockConnectionService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
