// src/app/app.component.ts
import { Component } from '@angular/core';
import { WeatherComponent } from './weather/weather.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherComponent],
  templateUrl: './app.component.html',  // Poprawne użycie pliku szablonu
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';
}
