import { Injectable } from '@angular/core';

@Injectable()
export class MockFlashMessagesService {
  constructor() {}
  public show(s: string, o: any): void {}
}
