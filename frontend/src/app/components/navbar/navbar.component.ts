import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AddedFoodsService } from '../../services/added-foods.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../services/connection.service';

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
  online;

  constructor(
    private auth: AuthService,
    private router: Router,
    private addedFoodsService: AddedFoodsService,
    private translator: TranslateService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
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
    this.addedFoodsService._openedSavedMeal.next(false);
  }

  changeLanguage() {
    if (this.lang === 'fi') {
      this.translator.use('en');
      if (this.isLoggedIn) {
        this.auth.updateLanguage('en');
      }
      this.lang = 'en';
    } else {
      this.translator.use('fi');
      if (this.isLoggedIn) {
        this.auth.updateLanguage('fi');
      }
      this.lang = 'fi';
    }
  }
}
