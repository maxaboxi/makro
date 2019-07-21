import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFoodsComponent } from './admin-foods.component';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from 'src/app/services/admin.service';
import { FoodService } from 'src/app/services/food.service';
import { MockFoodService } from 'src/app/test-helpers/MockFoodService';
import { MockAdminService } from 'src/app/test-helpers/MockAdminService';
import { MockTranslateService } from 'src/app/test-helpers/MockTranslateService';
import { MockFlashMessagesService } from 'src/app/test-helpers/MockFlashMessagesService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('AdminFoodsComponent', () => {
  let component: AdminFoodsComponent;
  let fixture: ComponentFixture<AdminFoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFoodsComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FlashMessagesService, useClass: MockFlashMessagesService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: AdminService, useClass: MockAdminService },
        { provide: FoodService, useClass: MockFoodService }
      ],
      imports: [NgbModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
