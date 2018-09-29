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
import { FeedbackComponent } from './components/feedback/feedback.component';
import { TargetsComponent } from './components/dashboard/meals/targets/targets.component';
import { MealTableComponent } from './components/dashboard/meals/meal-table/meal-table.component';
import { TotalsComponent } from './components/dashboard/meals/totals/totals.component';
import { AboutComponent } from './components/about/about.component';
import { SharedMealsComponent } from './components/shared-meals/shared-meals.component';
import { SharedMealComponent } from './components/shared-meals/shared-meal/shared-meal.component';
import { SavedDaysComponent } from './components/profile/saved-days/saved-days.component';
import { AddedFoodsComponent } from './components/profile/added-foods/added-foods.component';
import { UserSharedMealsComponent } from './components/profile/user-shared-meals/user-shared-meals.component';
import { SharedDaysComponent } from './components/profile/shared-days/shared-days.component';

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
    FeedbackComponent,
    TargetsComponent,
    MealTableComponent,
    TotalsComponent,
    AboutComponent,
    SharedMealsComponent,
    SharedMealComponent,
    SavedDaysComponent,
    AddedFoodsComponent,
    UserSharedMealsComponent,
    SharedDaysComponent
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
