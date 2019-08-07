import { Injectable } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';

@Injectable()
export class MockDayService {
  public loadedDayName = new BehaviorSubject<string>(null);

  constructor() {}

  public getAllSavedDays() {
    return of([]);
  }

  public getSharedDaysByUser() {
    return of([]);
  }
}
