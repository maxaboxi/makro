import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AddedFoodsService } from '../../services/added-foods.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionService } from '../../services/connection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showDialog = false;
  isNavbarCollapsed = true;
  isLoggedIn: boolean;
  isAdmin: boolean;
  lang: string;
  online: boolean;

  private subscriptions = new Subscription();

  constructor(
    private auth: AuthService,
    private router: Router,
    private addedFoodsService: AddedFoodsService,
    private translator: TranslateService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.subscriptions.add(this.connectionService.monitor().subscribe(res => (this.online = res)));
    this.lang = localStorage.getItem('makro_lang');
    this.auth.getUserInfo();
    this.subscriptions.add(
      this.auth.isLoggedIn.subscribe(res => {
        this.isLoggedIn = res;
        this.subscriptions.add(this.auth.isAdmin.subscribe(res => (this.isAdmin = res)));
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  logout() {
    this.router.navigate(['/login']);
    this.addedFoodsService.resetTotals();
    this.auth.logout();
    this.addedFoodsService.setMealsFromLocalStorage();
    this.addedFoodsService._openedSavedMeal.next(false);
    this.addedFoodsService._previousMealsSavedToLocalStorage.next(false);
    this.addedFoodsService._mealsEdited.next(false);
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
