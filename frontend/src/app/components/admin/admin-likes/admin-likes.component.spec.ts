import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLikesComponent } from './admin-likes.component';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockAdminService } from 'src/app/test-helpers/MockAdminService';
import { MockLikeService } from 'src/app/test-helpers/MockLikeService';
import { LikeService } from 'src/app/services/like.service';
import { AdminService } from 'src/app/services/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('AdminLikesComponent', () => {
  let component: AdminLikesComponent;
  let fixture: ComponentFixture<AdminLikesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminLikesComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AdminService, useClass: MockAdminService },
        { provide: LikeService, useClass: MockLikeService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
