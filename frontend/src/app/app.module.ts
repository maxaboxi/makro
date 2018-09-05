import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/dashboard/search/search.component';
import { AdminComponent } from './components/admin/admin.component';
import { ToolbarComponent } from './components/dashboard/toolbar/toolbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MealsComponent } from './components/dashboard/meals/meals.component';
import { AddedFoodsComponent } from './components/dashboard/meals/added-foods/added-foods.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { TargetsComponent } from './components/dashboard/meals/targets/targets.component';
import { MealTableComponent } from './components/dashboard/meals/added-foods/meal-table/meal-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    SearchComponent,
    AdminComponent,
    ToolbarComponent,
    ProfileComponent,
    MealsComponent,
    AddedFoodsComponent,
    FeedbackComponent,
    TargetsComponent,
    MealTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FlashMessagesModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
