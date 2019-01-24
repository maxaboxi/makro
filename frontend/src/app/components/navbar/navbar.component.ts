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
  lang: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private addedFoodsService: AddedFoodsService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.lang = localStorage.getItem('makro_lang');
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
    if (this.lang === 'fi') {
      this.translator.use('en');
      this.auth.updateLanguage('en');
      this.lang = 'en';
    } else {
      this.translator.use('fi');
      this.auth.updateLanguage('fi');
      this.lang = 'fi';
    }
  }
}
