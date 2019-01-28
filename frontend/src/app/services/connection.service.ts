import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, fromEvent, merge, empty, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { mapTo, defaultIfEmpty } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private connectionMonitor: Observable<boolean>;
  private isLoggedin = new BehaviorSubject<boolean>(true);

  constructor(@Inject(PLATFORM_ID) platform) {
    if (isPlatformBrowser(platform)) {
      const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));
      const online$ = fromEvent(window, 'online').pipe(mapTo(true));
      this.connectionMonitor = merge(offline$, online$);
    } else {
      this.connectionMonitor = empty();
    }
    this.connectionMonitor.subscribe(res => this.isLoggedin.next(res));
  }

  monitor(): Observable<boolean> {
    return this.isLoggedin;
  }
}
