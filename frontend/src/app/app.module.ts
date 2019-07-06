import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { TinymceModule } from 'angular2-tinymce';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { UserLikesComponent } from './components/profile/user-likes/user-likes.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AdminFoodsComponent } from './components/admin/admin-foods/admin-foods.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminDaysComponent } from './components/admin/admin-days/admin-days.component';
import { DataListComponent } from './components/admin/data-list/data-list.component';
import { AdminLikesComponent } from './components/admin/admin-likes/admin-likes.component';
import { AdminMealsComponent } from './components/admin/admin-meals/admin-meals.component';
import { AdminFeedbacksComponent } from './components/admin/admin-feedbacks/admin-feedbacks.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { UserTrackedPeriodsComponent } from './components/profile/user-tracked-periods/user-tracked-periods.component';
import { AdminTrackedPeriodsComponent } from './components/admin/admin-tracked-periods/admin-tracked-periods.component';
import { ChangelogComponent } from './components/about/changelog/changelog.component';
import { GeneralComponent } from './components/about/general/general.component';
import { StatisticsComponent } from './components/about/statistics/statistics.component';
import { CompareMealPlansComponent } from './components/compare-meal-plans/compare-meal-plans.component';
import { CompareMealTableComponent } from './components/compare-meal-plans/compare-meal-table/compare-meal-table.component';
import { CompareTotalsComponent } from './components/compare-meal-plans/compare-totals/compare-totals.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i8n/', '.json');
}

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
    SharedDaysComponent,
    UserInfoComponent,
    UserLikesComponent,
    LoadingSpinnerComponent,
    AdminFoodsComponent,
    AdminUsersComponent,
    AdminDaysComponent,
    DataListComponent,
    AdminLikesComponent,
    AdminMealsComponent,
    AdminFeedbacksComponent,
    ResetpasswordComponent,
    UserTrackedPeriodsComponent,
    AdminTrackedPeriodsComponent,
    ChangelogComponent,
    GeneralComponent,
    StatisticsComponent,
    CompareMealPlansComponent,
    CompareMealTableComponent,
    CompareTotalsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ImageCropperModule,
    FlashMessagesModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TinymceModule.withConfig({
      auto_focus: true,
      branding: false,
      menubar: false,
      plugins: ['emoticons'],
      style_formats: [
        {
          title: 'Headers',
          items: [
            { title: 'Heading 1', block: 'h1' },
            { title: 'Heading 2', block: 'h2' },
            { title: 'Heading 3', block: 'h3' },
            { title: 'Heading 4', block: 'h4' },
            { title: 'Heading 5', block: 'h5' },
            { title: 'Heading 6', block: 'h6' }
          ]
        },

        {
          title: 'Inline',
          items: [
            { title: 'Bold', inline: 'b', icon: 'bold' },
            { title: 'Italic', inline: 'i', icon: 'italic' },
            { title: 'Superscript', inline: 'sup', icon: 'superscript' },
            { title: 'Subscript', inline: 'sub', icon: 'subscript' },
            { title: 'Code', inline: 'code', icon: 'code' }
          ]
        },

        {
          title: 'Blocks',
          items: [
            { title: 'Paragraph', block: 'p' },
            { title: 'Blockquote', block: 'blockquote' },
            { title: 'Div', block: 'div' },
            { title: 'Pre', block: 'pre' }
          ]
        },

        {
          title: 'Alignment',
          items: [
            {
              title: 'Left',
              block: 'div',
              styles: { textAlign: 'left' },
              icon: 'alignleft'
            },
            {
              title: 'Center',
              block: 'div',
              styles: { textAlign: 'center' },
              icon: 'aligncenter'
            },
            {
              title: 'Right',
              block: 'div',
              styles: { textAlign: 'right' },
              icon: 'alignright'
            },
            {
              title: 'Justify',
              block: 'div',
              styles: { textAlign: 'justify' },
              icon: 'alignjustify'
            }
          ]
        }
      ],
      toolbar: [
        'undo redo | styleselect | alignleft aligncenter alignright alignjustify outdent indent',
        'bold italic blockquote | emoticons'
      ]
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
