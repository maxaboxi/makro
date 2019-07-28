import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Like } from '../models/Like';

@Injectable()
export class MockLikeService {
  constructor() {}

  public removeLikes() {
    return of(true);
  }

  public getAllUserLikesWithId() {
    return of([]);
  }

  public likePost(like: Like) {
    return of({});
  }

  public replacePreviousLike(like: Like, mealid: string) {
    return of({});
  }
}
