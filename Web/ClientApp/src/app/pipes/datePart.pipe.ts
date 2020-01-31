import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'datePart' })
export class DatePart implements PipeTransform {
  transform(value: string): string {
    return value.split(' ')[0];
  }
}
