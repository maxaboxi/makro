import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  showOlderUpdates = false;
  usersCount: number;
  foodsCount: number;

  constructor(private auth: AuthService, private foodService: FoodService) {}

  ngOnInit() {
    this.auth.getUsersCount().subscribe(res => (this.usersCount = res['count']));
    this.foodService.getFoodsCount().subscribe(res => (this.foodsCount = res['count']));
  }

  toggleShowOlderUpdates() {
    this.showOlderUpdates = !this.showOlderUpdates;
  }
}
