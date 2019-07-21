import { User } from '../models/User';
import { of, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthService {
  public isLoggedIn = new BehaviorSubject<boolean>(false);
  public user = new BehaviorSubject<User>({ username: '', lang: 'fi', userAddedExpenditure: 1, dailyExpenditure: 1 });
  public isAdmin = new BehaviorSubject<boolean>(false);

  constructor() {}
  public resetPassword(user: User) {
    return of({});
  }

  public login(data: any) {
    return of({});
  }

  public register(data: any) {
    return of({});
  }

  public forgotPassword() {
    return of({});
  }

  public setUserInfo(user: User): void {}

  public fetchUserInfo() {
    return of({ username: '', lang: 'fi', userAddedExpenditure: 1, dailyExpenditure: 1 });
  }

  public getUserInfo(): void {}
}
