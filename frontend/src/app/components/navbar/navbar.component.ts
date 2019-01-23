import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AddedFoodsService } from '../../services/added-foods.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showDialog = false;
  isNavbarCollapsed = true;
  isLoggedIn: Boolean;
  isAdmin: Boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private addedFoodsService: AddedFoodsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.auth.getUserInfo();
    this.auth.isLoggedIn.subscribe(res => {
      this.isLoggedIn = res;
      this.auth.isAdmin.subscribe(res => (this.isAdmin = res));
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.addedFoodsService.resetTotals();
    this.auth.logout();
    this.addedFoodsService.setMealsFromLocalStorage();
  }

  changeLanguage() {
    const lang = localStorage.getItem('makro_lang');
    if (lang === 'fi') {
      this.translate.use('en');
      localStorage.setItem('makro_lang', 'en');
    } else {
      this.translate.use('fi');
      localStorage.setItem('makro_lang', 'fi');
    }
  }
}
