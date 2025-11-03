import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from './locale.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure so it updates when language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private localeService: LocaleService) {}

  transform(key: string): string {
    return this.localeService.translate(key);
  }
}
