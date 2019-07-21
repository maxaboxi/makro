import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDaysComponent } from './admin-days.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { AdminService } from 'src/app/services/admin.service';
import { MockAdminService } from 'src/app/test-helpers/MockAdminService';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminDaysComponent', () => {
  let component: AdminDaysComponent;
  let fixture: ComponentFixture<AdminDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDaysComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AdminService, useClass: MockAdminService }
      ],
      imports: [NgbModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
