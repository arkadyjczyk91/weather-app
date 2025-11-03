import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from './locale.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {

  constructor(private localeService: LocaleService) {}

  transform(key: string): string {
    return this.localeService.translate(key);
  }
}
