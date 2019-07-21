import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockConnectionService {
  constructor() {}

  public monitor() {
    return of(true);
  }
}
