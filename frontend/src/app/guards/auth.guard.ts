import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate() {
    if (this.auth.isLoggedIn.getValue()) {
      return true;
    } else {
      if (localStorage.getItem('token')) {
        this.auth.validateToken().subscribe(
          res => {
            if (res['success']) {
              this.auth.isLoggedIn.next(true);
              this.router.navigate(['/']);
              return true;
            } else {
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
              return false;
            }
          },
          (error: Error) => {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
            return false;
          }
        );
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}
