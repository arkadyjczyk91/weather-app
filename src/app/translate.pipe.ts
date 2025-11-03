import { Pipe, PipeTransform, effect, signal } from '@angular/core';
import { LocaleService } from './locale.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: true
})
export class TranslatePipe implements PipeTransform {
  private updateTrigger = signal(0);

  constructor(private localeService: LocaleService) {
    // Watch for language changes and trigger pipe update
    effect(() => {
      // Access the signal to track changes
      this.localeService.languageSignal();
      this.updateTrigger.update(v => v + 1);
    });
  }

  transform(key: string): string {
    // Access the trigger to ensure pure pipe re-evaluates
    this.updateTrigger();
    return this.localeService.translate(key);
  }
}
