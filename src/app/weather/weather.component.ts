// src/app/weather/weather.component.ts
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {WeatherService} from '../weather.service';
import {MaterialModule} from '../material/material.module';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import * as L from 'leaflet';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, AfterViewInit, OnDestroy {
  city: string = '';
  weather: any;
  forecast: any;
  airPollution: any;
  errorMessage: string = '';
  activeTab = 0;
  map: L.Map | null = null;
  selectedLayer: string = 'clouds_new';

  // Zmienne dla czasu
  userLocalTime: Date = new Date();
  locationLocalTime: Date | null = null;
  locationTimezone: string = '';
  timeInterval: any;

  // Zmienne dla wyszukiwania
  searchResults: any[] = [];
  isSearching = false;

  mapLayers = [
    {value: 'clouds_new', label: 'Chmury'},
    {value: 'precipitation_new', label: 'Opady'},
    {value: 'pressure_new', label: 'Ciśnienie'},
    {value: 'wind_new', label: 'Wiatr'},
    {value: 'temp_new', label: 'Temperatura'}
  ];

  currentTileLayer: L.TileLayer | null = null;
  weatherTileLayer: L.TileLayer | null = null;
  mapInitialized = false;
  coordinates: [number, number] | null = null;

  private searchTerms = new Subject<string>();

  constructor(private weatherService: WeatherService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);

    this.timeInterval = setInterval(() => {
      this.userLocalTime = new Date();
      this.updateLocationTime();
    }, 1000);

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term && term.length >= 3) {
        this.performSearch(term);
      } else {
        this.searchResults = [];
      }
    });
  }

  onSearchInput(event: any) {
    const term = event.target.value;
    this.searchTerms.next(term);
  }

  performSearch(term: string) {
    this.isSearching = true;
    this.errorMessage = '';

    this.weatherService.searchLocations(term).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.isSearching = false;
        if (data.length === 0 && term.length >= 3) {
          this.errorMessage = 'Nie znaleziono pasujących miejscowości';
        }
      },
      error: (error) => {
        console.error('Błąd podczas wyszukiwania:', error);
        this.isSearching = false;
        this.searchResults = [];
      }
    });
  }

  ngAfterViewInit() {
    // Puste, inicjalizacja mapy przeniesiona do ngOnInit
  }

  // Pamiętaj o oczyszczeniu zasobów
  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.searchTerms) {
      this.searchTerms.complete();
    }
  }

  // Aktualizacja czasu dla wybranej lokalizacji
  updateLocationTime() {
    if (this.weather && this.weather.timezone !== undefined) {
      // Obliczenie czasu lokalnego w wybranej lokalizacji na podstawie UTC i przesunięcia strefy
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      this.locationLocalTime = new Date(utcTime + (1000 * this.weather.timezone));
    }
  }

  // Funkcja zwracająca nazwę strefy czasowej
  getTimezoneName(offsetSeconds: number): string {
    const offsetHours = Math.abs(Math.floor(offsetSeconds / 3600));
    const offsetMinutes = Math.abs(Math.floor((offsetSeconds % 3600) / 60));
    const sign = offsetSeconds >= 0 ? '+' : '-';
    return `UTC${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
  }

  getAqiDescription(aqi: number): { text: string, color: string } {
    switch (aqi) {
      case 1:
        return {text: 'Bardzo dobra', color: '#009966'};
      case 2:
        return {text: 'Dobra', color: '#ffde33'};
      case 3:
        return {text: 'Umiarkowana', color: '#ff9933'};
      case 4:
        return {text: 'Zła', color: '#cc0033'};
      case 5:
        return {text: 'Bardzo zła', color: '#660099'};
      default:
        return {text: 'Brak danych', color: '#999999'};
    }
  }

  private initMap() {
    if (this.mapInitialized) return;

    const defaultCoords: [number, number] = [52.2297, 21.0122];
    const coords = this.coordinates || defaultCoords;

    // Konfiguracja ikon dla markerów
    const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/marker-icon.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';

    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    // Inicjalizacja mapy
    this.map = L.map('map').setView(coords, 6);

    this.currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Dodanie markera, jeśli współrzędne są dostępne
    if (this.coordinates) {
      L.marker(this.coordinates).addTo(this.map)
        .bindPopup(this.city).openPopup();
    }

    // Obsługa kliknięcia na mapie
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      this.getWeatherByCoords(lat, lon);
    });

    this.updateWeatherLayer();
    this.mapInitialized = true;
  }

  updateWeatherLayer() {
    if (!this.map) return;

    if (this.weatherTileLayer) {
      this.map.removeLayer(this.weatherTileLayer);
    }

    const url = this.weatherService.getWeatherMapUrl(this.selectedLayer);
    this.weatherTileLayer = L.tileLayer(url, {
      attribution: 'Map data © OpenWeatherMap',
      opacity: 0.7
    }).addTo(this.map);
  }

  onLayerChange() {
    this.updateWeatherLayer();
  }

  selectLocation(location: any) {
    this.city = location.name;
    if (location.state) {
      this.city += `, ${location.state}`;
    }
    this.searchResults = [];

    const lat = location.lat;
    const lon = location.lon;
    this.coordinates = [lat, lon];

    this.moveToLocation();

    this.loadWeatherData(lat, lon);
  }

  getWeatherByCoords(lat: number, lon: number) {
    this.coordinates = [lat, lon];

    // Najpierw pobierz dane o lokalizacji (reverse geocoding)
    this.weatherService.getReverseGeocoding(lat, lon).subscribe({
      next: (geoData) => {
        if (geoData && geoData.length > 0) {
          // Aktualizuj nazwę miasta na podstawie danych geocoding
          let locationName: string;
          if (geoData[0].name) {
            locationName = geoData[0].name;
            if (geoData[0].state) {
              locationName += `, ${geoData[0].state}`;
            }
            if (geoData[0].country) {
              locationName += ` (${geoData[0].country})`;
            }
          } else {
            locationName = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
          }
          this.city = locationName;

          // Aktualizacja markera na mapie
          if (this.map && this.coordinates) { // Sprawdzenie, czy coordinates nie jest null
            this.map.eachLayer(layer => {
              if (layer instanceof L.Marker) {
                this.map?.removeLayer(layer);
              }
            });

            L.marker(this.coordinates).addTo(this.map)
              .bindPopup(locationName).openPopup();
          }
        }
      },
      error: (error) => {
        console.error('Błąd podczas pobierania danych geokodowania:', error);
        this.city = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
      },
      complete: () => {
        this.loadWeatherData(lat, lon);
      }
    });
  }

  private loadWeatherData(lat: number, lon: number) {
    // Pobieranie danych pogodowych na podstawie współrzędnych
    this.weatherService.getWeatherByCoords(lat, lon).subscribe({
      next: (data) => {
        this.weather = data;
        if (data.name) {
          this.city = data.name;
        }
        this.locationTimezone = this.getTimezoneName(data.timezone);
        this.updateLocationTime();
      },
      error: (error) => {
        this.errorMessage = 'Błąd podczas pobierania danych pogodowych.';
        console.error('Błąd podczas pobierania danych pogodowych:', error);
      }
    });

    // Pobieranie prognozy
    this.weatherService.getForecastByCoords(lat, lon).subscribe({
      next: (data) => {
        this.forecast = this.processForecastData(data);
      },
      error: (error) => {
        console.error('Błąd podczas pobierania prognozy:', error);
      }
    });

    // Pobieranie danych o jakości powietrza
    this.weatherService.getAirPollution(lat, lon).subscribe({
      next: (data) => {
        this.airPollution = data;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania danych o jakości powietrza:', error);
      }
    });
  }

  getWeather() {
    if (!this.city) {
      this.errorMessage = 'Wprowadź nazwę miasta';
      return;
    }

    if (this.city.length < 3) {
      this.errorMessage = 'Nazwa miasta musi zawierać co najmniej 3 znaki';
      return;
    }

    this.errorMessage = '';
    this.isSearching = true; // Dodanie wskaźnika ładowania

    this.weatherService.getGeoCoordinates(this.city).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.coordinates = [data[0].lat, data[0].lon];

          // Pobierz dane o jakości powietrza
          this.weatherService.getAirPollution(data[0].lat, data[0].lon).subscribe({
            next: (airData) => {
              this.airPollution = airData;
            },
            error: (error) => {
              console.error('Błąd podczas pobierania danych o jakości powietrza:', error);
            }
          });

          // Jeśli mapa jest już zainicjalizowana, przesuń widok
          this.moveToLocation();

          // Pobierz wszystkie pozostałe dane
          this.loadWeatherData(data[0].lat, data[0].lon);
        } else {
          // Dodanie obsługi pustej odpowiedzi (brak wyników)
          this.errorMessage = 'Nie znaleziono podanej miejscowości. Sprawdź pisownię i spróbuj ponownie.';
        }
        this.isSearching = false; // Zakończenie ładowania
      },
      error: (error) => {
        console.error('Błąd podczas pobierania współrzędnych:', error);
        this.errorMessage = 'Nie udało się znaleźć miejscowości. Sprawdź połączenie internetowe i spróbuj ponownie.';
        this.isSearching = false; // Zakończenie ładowania w przypadku błędu
      }
    });
  }

  private moveToLocation() {
    if (this.map && this.coordinates) {
      this.map.setView(this.coordinates, 8);
      // Usuń wszystkie markery i dodaj nowy
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          this.map?.removeLayer(layer);
        }
      });

      // Dodaj marker tylko jeśli współrzędne nie są null
      L.marker(this.coordinates).addTo(this.map)
        .bindPopup(this.city).openPopup();
    }
  }

  processForecastData(data: any) {
    const groupedByDate: { [key: string]: any[] } = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('pl-PL');

      if (!groupedByDate[day]) {
        groupedByDate[day] = [];
      }

      groupedByDate[day].push({
        time: date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'}),
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        wind: item.wind.speed,
        visibility: item.visibility / 1000,
        clouds: item.clouds?.all || 0
      });
    });

    return Object.entries(groupedByDate).map(([date, forecasts]) => ({date, forecasts}));
  }
}
