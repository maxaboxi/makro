import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FoodService } from '../../services/food.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  showOlderUpdates = false;
  usersCount: number;
  foodsCount: number;
  loading = true;

  constructor(
    private auth: AuthService,
    private foodService: FoodService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.getUsersCount().subscribe(
      res => {
        this.usersCount = res['count'];
        this.foodService.getFoodsCount().subscribe(res => {
          this.foodsCount = res['count'];
          this.loading = false;
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
}
