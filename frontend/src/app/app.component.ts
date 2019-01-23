import { Component, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private renderer: Renderer2, translate: TranslateService) {
    this.renderer.addClass(document.body, 'colors');
    translate.setDefaultLang('fi');
    translate.use('fi');
    localStorage.setItem('lang', 'fi');
  }
}
