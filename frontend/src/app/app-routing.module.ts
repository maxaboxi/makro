import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { AdminComponent } from './components/admin/admin.component';
import { AboutComponent } from './components/about/about.component';
import { SharedMealsComponent } from './components/shared-meals/shared-meals.component';
import { AddedFoodsComponent } from './components/profile/added-foods/added-foods.component';
import { UserSharedMealsComponent } from './components/profile/user-shared-meals/user-shared-meals.component';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { SavedDaysComponent } from './components/profile/saved-days/saved-days.component';
import { AdminFoodsComponent } from './components/admin/admin-foods/admin-foods.component';
import { AdminMealsComponent } from './components/admin/admin-meals/admin-meals.component';
import { AdminDaysComponent } from './components/admin/admin-days/admin-days.component';
import { AdminLikesComponent } from './components/admin/admin-likes/admin-likes.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminFeedbacksComponent } from './components/admin/admin-feedbacks/admin-feedbacks.component';
import { UserLikesComponent } from './components/profile/user-likes/user-likes.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { UserTrackedPeriodsComponent } from './components/profile/user-tracked-periods/user-tracked-periods.component';
import { AdminTrackedPeriodsComponent } from './components/admin/admin-tracked-periods/admin-tracked-periods.component';
import { GeneralComponent } from './components/about/general/general.component';
import { ChangelogComponent } from './components/about/changelog/changelog.component';
import { StatisticsComponent } from './components/about/statistics/statistics.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UserInfoComponent },
      { path: 'foods', component: AddedFoodsComponent },
      { path: 'meals', component: UserSharedMealsComponent },
      { path: 'days', component: SavedDaysComponent },
      { path: 'likes', component: UserLikesComponent },
      { path: 'trackedperiods', component: UserTrackedPeriodsComponent }
    ]
  },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  {
    path: 'sharedmeals',
    component: SharedMealsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
    children: [
      { path: '', component: GeneralComponent },
      { path: 'stats', component: StatisticsComponent },
      { path: 'changelog', component: ChangelogComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminUsersComponent },
      { path: 'foods', component: AdminFoodsComponent },
      { path: 'meals', component: AdminMealsComponent },
      { path: 'days', component: AdminDaysComponent },
      { path: 'likes', component: AdminLikesComponent },
      { path: 'feedbacks', component: AdminFeedbacksComponent },
      { path: 'trackedperiods', component: AdminTrackedPeriodsComponent }
    ]
  },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
