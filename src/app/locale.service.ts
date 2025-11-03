import { Injectable, signal } from '@angular/core';

export type SupportedLanguage = 'pl' | 'en';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private currentLang = signal<SupportedLanguage>('pl');
  private translations: { [lang: string]: Translations } = {
    pl: {
      // Header
      'app.title': 'Pogoda',
      
      // Search
      'search.input.label': 'Wprowadź nazwę miasta',
      'search.input.placeholder': 'np. Warszawa',
      'search.button': 'Sprawdź pogodę',
      'search.error.notFound': 'Nie znaleziono pasujących miejscowości',
      'search.error.empty': 'Wprowadź nazwę miasta',
      'search.error.tooShort': 'Nazwa miasta musi zawierać co najmniej 3 znaki',
      'search.error.notFoundDetailed': 'Nie znaleziono podanej miejscowości. Sprawdź pisownię i spróbuj ponownie.',
      'search.error.network': 'Nie udało się znaleźć miejscowości. Sprawdź połączenie internetowe i spróbuj ponownie.',
      
      // Time
      'time.userLocal': 'Czas lokalny użytkownika',
      'time.locationLocal': 'Czas w',
      
      // Day periods
      'time.morning': 'ranek',
      'time.day': 'dzień',
      'time.evening': 'wieczór',
      'time.night': 'noc',
      
      // Map
      'map.layer.label': 'Warstwa pogodowa',
      'map.layer.clouds': 'Chmury',
      'map.layer.precipitation': 'Opady',
      'map.layer.pressure': 'Ciśnienie',
      'map.layer.wind': 'Wiatr',
      'map.layer.temperature': 'Temperatura',
      'map.hint': 'Kliknij na mapę, aby sprawdzić pogodę dla wybranego miejsca',
      
      // Tabs
      'tab.current': 'Aktualna pogoda',
      'tab.forecast': 'Prognoza 5-dniowa',
      
      // Weather details
      'weather.details': 'Szczegółowe informacje',
      'weather.humidity': 'Wilgotność',
      'weather.pressure': 'Ciśnienie',
      'weather.wind': 'Wiatr',
      'weather.feelsLike': 'Temperatura odczuwalna',
      'weather.visibility': 'Widoczność',
      'weather.cloudiness': 'Zachmurzenie',
      
      // Air quality
      'air.quality': 'Jakość powietrza',
      'air.veryGood': 'Bardzo dobra',
      'air.good': 'Dobra',
      'air.moderate': 'Umiarkowana',
      'air.bad': 'Zła',
      'air.veryBad': 'Bardzo zła',
      'air.noData': 'Brak danych',
      
      // Forecast
      'forecast.feelsLike': 'Odczuwalna',
      
      // Language
      'language.select': 'Język',
      'language.polish': 'Polski',
      'language.english': 'English'
    },
    en: {
      // Header
      'app.title': 'Weather',
      
      // Search
      'search.input.label': 'Enter city name',
      'search.input.placeholder': 'e.g. Warsaw',
      'search.button': 'Check Weather',
      'search.error.notFound': 'No matching locations found',
      'search.error.empty': 'Enter city name',
      'search.error.tooShort': 'City name must contain at least 3 characters',
      'search.error.notFoundDetailed': 'Location not found. Check spelling and try again.',
      'search.error.network': 'Could not find location. Check your internet connection and try again.',
      
      // Time
      'time.userLocal': 'Your local time',
      'time.locationLocal': 'Time in',
      
      // Day periods
      'time.morning': 'morning',
      'time.day': 'day',
      'time.evening': 'evening',
      'time.night': 'night',
      
      // Map
      'map.layer.label': 'Weather layer',
      'map.layer.clouds': 'Clouds',
      'map.layer.precipitation': 'Precipitation',
      'map.layer.pressure': 'Pressure',
      'map.layer.wind': 'Wind',
      'map.layer.temperature': 'Temperature',
      'map.hint': 'Click on the map to check weather for selected location',
      
      // Tabs
      'tab.current': 'Current Weather',
      'tab.forecast': '5-Day Forecast',
      
      // Weather details
      'weather.details': 'Detailed Information',
      'weather.humidity': 'Humidity',
      'weather.pressure': 'Pressure',
      'weather.wind': 'Wind',
      'weather.feelsLike': 'Feels like',
      'weather.visibility': 'Visibility',
      'weather.cloudiness': 'Cloudiness',
      
      // Air quality
      'air.quality': 'Air Quality',
      'air.veryGood': 'Very Good',
      'air.good': 'Good',
      'air.moderate': 'Moderate',
      'air.bad': 'Bad',
      'air.veryBad': 'Very Bad',
      'air.noData': 'No Data',
      
      // Forecast
      'forecast.feelsLike': 'Feels like',
      
      // Language
      'language.select': 'Language',
      'language.polish': 'Polski',
      'language.english': 'English'
    }
  };

  constructor() {
    // Load language from localStorage or default to Polish
    const savedLang = localStorage.getItem('weatherAppLang') as SupportedLanguage;
    if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
      this.currentLang.set(savedLang);
    }
  }

  get language() {
    return this.currentLang();
  }

  get languageSignal() {
    return this.currentLang.asReadonly();
  }

  setLanguage(lang: SupportedLanguage) {
    this.currentLang.set(lang);
    localStorage.setItem('weatherAppLang', lang);
  }

  translate(key: string): string {
    const translation = this.translations[this.currentLang()][key];
    return translation || key;
  }

  getLocaleCode(): string {
    return this.currentLang() === 'pl' ? 'pl-PL' : 'en-US';
  }
}
