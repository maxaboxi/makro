import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { Statistics } from 'src/app/models/Statistics';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  loading = true;
  loadingStats = false;
  statistics: Statistics;

  private subscriptions = new Subscription();

  constructor(
    private statisticsService: StatisticsService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.statisticsService.getStats().subscribe(
        stats => {
          this.statistics = stats;
          this.loading = false;
        },
        (error: Error) => {
          this.loading = false;
          this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
