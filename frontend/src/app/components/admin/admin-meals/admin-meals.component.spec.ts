import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMealsComponent } from './admin-meals.component';
import { MockSharedMealsService } from 'src/app/test-helpers/MockSharedMealsService';
import { SharedMealsService } from 'src/app/services/shared-meals.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { AdminService } from 'src/app/services/admin.service';
import { MockAdminService } from 'src/app/test-helpers/MockAdminService';

describe('AdminMealsComponent', () => {
  let component: AdminMealsComponent;
  let fixture: ComponentFixture<AdminMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMealsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: SharedMealsService, useClass: MockSharedMealsService },
        { provide: AdminService, useClass: MockAdminService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
