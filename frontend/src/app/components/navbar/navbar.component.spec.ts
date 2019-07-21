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
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
