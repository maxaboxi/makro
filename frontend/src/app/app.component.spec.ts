import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from './test-helpers/MockTranslateService';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
describe('AppComponent', () => {
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
