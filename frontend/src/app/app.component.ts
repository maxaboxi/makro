import { Component, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private renderer: Renderer2, translate: TranslateService) {
    this.renderer.addClass(document.body, 'colors');
    translate.setDefaultLang('fi');
    const lang = localStorage.getItem('makro_lang') ? localStorage.getItem('makro_lang') : 'fi';
    translate.use(lang);
    localStorage.setItem('makro_lang', lang);
  }
}
