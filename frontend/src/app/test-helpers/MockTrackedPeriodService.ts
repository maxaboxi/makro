import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockTrackedPeriodService {
  constructor() {}

  public getAllTrackedPeriods() {
    return of([]);
  }
}
