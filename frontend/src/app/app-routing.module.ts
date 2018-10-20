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
import { QuestionComponent } from './components/qa/question/question.component';
import { AddedFoodsComponent } from './components/profile/added-foods/added-foods.component';
import { UserSharedMealsComponent } from './components/profile/user-shared-meals/user-shared-meals.component';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { SavedDaysComponent } from './components/profile/saved-days/saved-days.component';
import { UserQaComponent } from './components/profile/user-qa/user-qa.component';
import { UserQuestionsComponent } from './components/profile/user-qa/user-questions/user-questions.component';
import { UserAnswersComponent } from './components/profile/user-qa/user-answers/user-answers.component';
import { UserCommentsComponent } from './components/profile/user-qa/user-comments/user-comments.component';
import { UserVotesComponent } from './components/profile/user-qa/user-votes/user-votes.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UserInfoComponent },
      { path: 'foods', component: AddedFoodsComponent },
      { path: 'meals', component: UserSharedMealsComponent },
      { path: 'days', component: SavedDaysComponent },
      {
        path: 'qa',
        component: UserQaComponent,
        children: [
          { path: '', component: UserQuestionsComponent },
          { path: 'answers', component: UserAnswersComponent },
          { path: 'comments', component: UserCommentsComponent }
        ]
      },
      { path: 'votes', component: UserVotesComponent }
    ]
  },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  {
    path: 'sharedmeals',
    component: SharedMealsComponent,
    canActivate: [AuthGuard]
  },
  { path: 'qa', component: QaComponent, canActivate: [AuthGuard] },
  { path: 'question', component: QuestionComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
