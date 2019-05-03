import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FoodService } from 'src/app/services/food.service';
import { DayService } from 'src/app/services/day.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { UserStats } from 'src/app/models/UserStats';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
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
            this.auth.getUserStats().subscribe(
              stats => {
                this.userStats = stats;
                this.loading = false;
              },
              (error: Error) => {
                this.loading = false;
                this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
                  cssClass: 'alert-danger',
                  timeout: 2000
                });
              }
            );
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
}
