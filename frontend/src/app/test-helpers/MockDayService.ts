import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockDayService {
  constructor() {}

  public getAllSavedDays() {
    return of([]);
  }

  public getSharedDaysByUser() {
    return of([]);
  }
}
