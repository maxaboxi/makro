import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FoodService } from '../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { UserStats } from '../../models/UserStats';
import { DayService } from 'src/app/services/day.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  showOlderUpdates = false;
  usersCount: number;
  foodsCount: number;
  daysCount: number;
  loading = true;
  loadingStats = false;
  showStats = false;
  userStats: UserStats;

  constructor(
    private auth: AuthService,
    private foodService: FoodService,
    private dayService: DayService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.getUsersCount().subscribe(
      res => {
        this.usersCount = res['amount'];
        this.foodService.getFoodsCount().subscribe(res => {
          this.foodsCount = res['amount'];
          this.dayService.getSavedDaysCount().subscribe(res => {
            this.daysCount = res['amount'];
            this.loading = false;
          });
        });
      },
      (error: Error) => {
        this.loading = false;
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  toggleShowOlderUpdates() {
    this.showOlderUpdates = !this.showOlderUpdates;
  }

  getUserStats() {
    this.showStats = !this.showStats;
    if (this.showStats) {
      this.loadingStats = true;
      this.auth.getUserStats().subscribe(
        stats => (this.userStats = stats),
        (error: Error) => {
          this.loading = false;
          this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      );
      this.loadingStats = false;
    }
  }
}
