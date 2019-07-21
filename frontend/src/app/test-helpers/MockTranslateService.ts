import { Injectable } from '@angular/core';

@Injectable()
export class MockTranslateService {
  public instant(): void {}
  public use(lang: string): void {}
  public setDefaultLang(lang: string): void {}
}
