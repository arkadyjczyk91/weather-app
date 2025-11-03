// src/app/app.component.ts
import { Component } from '@angular/core';
import { WeatherComponent } from './weather/weather.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { LocaleService, SupportedLanguage } from './locale.service';
import { TranslatePipe } from './translate.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherComponent, CommonModule, MaterialModule, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';

  constructor(public localeService: LocaleService) {}

  changeLanguage(lang: SupportedLanguage) {
    this.localeService.setLanguage(lang);
  }
}
