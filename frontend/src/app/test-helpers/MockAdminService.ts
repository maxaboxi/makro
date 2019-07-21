import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockAdminService {
  constructor() {}

  public getMostRecentSharedDays() {
    return of([]);
  }

  public getMostRecentDays() {
    return of([]);
  }

  public getMostRecentFoods() {
    return of([]);
  }

  public getAllLikes() {
    return of([]);
  }

  public getAllTrackedPeriods() {
    return of([]);
  }

  public getMostRecentUsers() {
    return of([]);
  }
}
