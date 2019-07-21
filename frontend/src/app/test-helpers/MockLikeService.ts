import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockLikeService {
  constructor() {}

  public removeLikes() {
    return of(true);
  }

  public getAllUserLikesWithId() {
    return of([]);
  }
}
