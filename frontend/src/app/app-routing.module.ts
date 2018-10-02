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
import { QaComponent } from './components/qa/qa.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  {
    path: 'sharedmeals',
    component: SharedMealsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'qa', component: QaComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
