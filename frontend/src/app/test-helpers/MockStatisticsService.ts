import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockStatisticsService {
  constructor() {}

  public getStats() {
    return of([]);
  }

  public getAmountOfPdfCreatedByUser() {
    return of(0);
  }
}
