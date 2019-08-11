import { Component, Renderer2, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private subscriptions = new Subscription();

  constructor(private renderer: Renderer2, translate: TranslateService, private router: Router) {
    this.renderer.addClass(document.body, 'colors');
    translate.setDefaultLang('fi');
    const lang = localStorage.getItem('makro_lang') ? localStorage.getItem('makro_lang') : 'fi';
    translate.use(lang);
    localStorage.setItem('makro_lang', lang);
    this.subscriptions.add(
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          gtag('config', 'UA-145452699-1', { page_path: e.urlAfterRedirects });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
