import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockFeedbackService {
  constructor() {}

  public getAllFeedbacks() {
    return of([]);
  }

  public submitFeedback() {
    return of({});
  }
}
