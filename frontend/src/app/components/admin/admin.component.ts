import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FoodService } from '../../services/food.service';
import { DayService } from '../../services/day.service';
import { FeedbackService } from '../../services/feedback.service';
import { Feedback } from '../../models/Feedback';
import { User } from '../../models/User';
import { Day } from '../../models/Day';
import { Food } from '../../models/Food';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private users: User[];
  private days: Day[];
  private foods: Food[];
  private feedbacks: Feedback[];

  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private foodService: FoodService,
    private dayService: DayService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit() {
    this.foodService.getAllFoods().subscribe(foods => (this.foods = foods));
    this.feedbackService
      .getAllFeedbacks()
      .subscribe(feedbacks => (this.feedbacks = feedbacks));
    this.auth.getAllUsers().subscribe(users => (this.users = users));
    this.dayService.getAllDays().subscribe(days => (this.days = days));
  }
}
