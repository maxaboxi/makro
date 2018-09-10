import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AddedFoodsService } from '../../services/added-foods.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showDialog = false;
  isNavbarCollapsed = true;
  isLoggedIn: Boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private addedFoodsService: AddedFoodsService
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn.subscribe(res => {
      this.isLoggedIn = res;
    });
  }

  logout() {
    this.addedFoodsService.resetTotals();
    this.auth.logout();
    this.addedFoodsService.setMealsFromLocalStorage();
    this.router.navigate(['/login']);
  }
}
