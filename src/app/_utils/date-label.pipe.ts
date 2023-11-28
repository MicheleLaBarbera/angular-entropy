import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'dateLabel'})
export class DateLabelPipe implements PipeTransform {
  transform(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString("en-GB", { // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) + " - " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
  }
}