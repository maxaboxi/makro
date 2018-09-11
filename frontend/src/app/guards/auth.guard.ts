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
        this.auth.getUserInfo();
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
}
