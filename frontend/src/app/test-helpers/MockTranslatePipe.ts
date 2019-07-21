import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate' })
export class MockTranslatePipe implements PipeTransform {
  public name: string = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}
