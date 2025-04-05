// src/app/weather.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, from} from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'be948da4185eae28943ab730943dc353';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  private tileUrl = 'https://tile.openweathermap.org/map';
  private airPollutionUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';
  private geocodingUrl = 'https://api.openweathermap.org/geo/1.0/reverse';

  constructor(private http: HttpClient) {
  }

  // Metoda używająca Angular HttpClient
  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${city}&units=metric&lang=pl&appid=${this.apiKey}`);
  }

  getWeatherWithAxios(city: string): Observable<any> {
    return from(
      axios.get(`${this.apiUrl}?q=${city}&units=metric&lang=pl&appid=${this.apiKey}`)
        .then(response => response.data)
    );
  }

  getForecast(city: string): Observable<any> {
    return this.http.get(`${this.forecastUrl}?q=${city}&units=metric&lang=pl&appid=${this.apiKey}`);
  }

  getForecastWithAxios(city: string): Observable<any> {
    return from(
      axios.get(`${this.forecastUrl}?q=${city}&units=metric&lang=pl&appid=${this.apiKey}`)
        .then(response => response.data)
    );
  }

  getWeatherMapUrl(layer: string): string {
    return `${this.tileUrl}/${layer}/{z}/{x}/{y}.png?appid=${this.apiKey}`;
  }

  getGeoCoordinates(city: string): Observable<any> {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
    return this.http.get(geoUrl);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?lat=${lat}&lon=${lon}&units=metric&lang=pl&appid=${this.apiKey}`);
  }

  getForecastByCoords(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.forecastUrl}?lat=${lat}&lon=${lon}&units=metric&lang=pl&appid=${this.apiKey}`);
  }

  getAirPollution(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.airPollutionUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
  }

  getReverseGeocoding(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.geocodingUrl}?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`);
  }

  searchLocations(query: string): Observable<any[]> {
    // Użyj direct geocoding zamiast reverse geocoding
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`;

    return this.http.get<any[]>(url);
  }
}
