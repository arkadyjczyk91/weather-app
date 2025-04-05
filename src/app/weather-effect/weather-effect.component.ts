// weather-effect.component.ts
import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-weather-effect',
  templateUrl: './weather-effect.component.html',
  styleUrls: ['./weather-effect.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class WeatherEffectComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() weatherCode!: string;
  @Input() windSpeed: number = 0; // prędkość wiatru w m/s
  @Input() duration: number = -1; // -1 oznacza "bez limitu"
  @Input() temperature: number = 20; // temperatura w °C
  @Input() pressure: number = 1013; // ciśnienie w hPa
  @Input() humidity: number = 50; // wilgotność w procentach (%)
  @Input() time: string = '12:00'; // Lokalny czas w formacie HH:MM

  @ViewChild('effectsContainer') effectsContainer!: ElementRef;

  dayTimeEffect: string = 'day'; // możliwe wartości: morning, day, evening, night
  effectTypes: string[] = []; // przechowuje listę efektów
  showEffect: boolean = false;
  windIntensity: string = 'none'; // none, light, medium, strong
  temperatureEffect: string = 'normal';
  pressureEffect: string = 'normal';
  humidityEffect: string = 'normal';

  private animationTimers: number[] = []; // identyfikatory timerów do czyszczenia

  ngAfterViewInit() {
    // Uruchom efekty po załadowaniu widoku
    this.determineEffectTypes();
    this.determineWindIntensity();
    this.determineTemperatureEffect();
    this.determinePressureEffect();
    this.determineHumidityEffect();
    this.showEffectForDuration();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherCode'] || changes['windSpeed'] || changes['temperature'] ||
      changes['pressure'] || changes['humidity'] || changes['time']) {
      this.determineEffectTypes();
      this.determineWindIntensity();
      this.determineTemperatureEffect();
      this.determinePressureEffect();
      this.determineHumidityEffect();
      this.showEffectForDuration();
    }
  }

  private determineDayTimeEffect(): void {
    if (!this.time) {
      this.dayTimeEffect = 'day'; // wartość domyślna
      return;
    }

    let hour: number;

    // Sprawdź, czy mamy format HH:MM
    if (this.time.includes(':')) {
      hour = parseInt(this.time.split(':')[0], 10);
    } else {
      // Jeśli format jest nieprawidłowy, użyj domyślnej wartości
      this.dayTimeEffect = 'day';
      return;
    }

    if (isNaN(hour)) {
      this.dayTimeEffect = 'day';
      return;
    }

    if (hour >= 5 && hour < 10) {
      this.dayTimeEffect = 'morning';
    } else if (hour >= 10 && hour < 17) {
      this.dayTimeEffect = 'day';
    } else if (hour >= 17 && hour < 21) {
      this.dayTimeEffect = 'evening';
    } else {
      this.dayTimeEffect = 'night';
    }
  }

  private determineHumidityEffect(): void {
    if (this.humidity < 30) {
      this.humidityEffect = 'very-dry';
    } else if (this.humidity < 40) {
      this.humidityEffect = 'dry';
    } else if (this.humidity > 85) {
      this.humidityEffect = 'very-humid';
    } else if (this.humidity > 70) {
      this.humidityEffect = 'humid';
    } else {
      this.humidityEffect = 'normal';
    }
  }

  private determineTemperatureEffect(): void {
    if (this.temperature < -10) {
      this.temperatureEffect = 'extreme-cold';
    } else if (this.temperature < 0) {
      this.temperatureEffect = 'very-cold';
    } else if (this.temperature < 10) {
      this.temperatureEffect = 'cold';
    } else if (this.temperature > 30) {
      this.temperatureEffect = 'hot';
    } else if (this.temperature > 25) {
      this.temperatureEffect = 'warm';
    } else {
      this.temperatureEffect = 'normal';
    }
  }

  private determinePressureEffect(): void {
    if (this.pressure < 990) {
      this.pressureEffect = 'very-low';
    } else if (this.pressure < 1000) {
      this.pressureEffect = 'low';
    } else if (this.pressure > 1030) {
      this.pressureEffect = 'high';
    } else if (this.pressure > 1020) {
      this.pressureEffect = 'slightly-high';
    } else {
      this.pressureEffect = 'normal';
    }
  }

  private determineWindIntensity(): void {
    if (this.windSpeed < 3) {
      this.windIntensity = 'none';
    } else if (this.windSpeed < 7) {
      this.windIntensity = 'light';
    } else if (this.windSpeed < 12) {
      this.windIntensity = 'medium';
    } else {
      this.windIntensity = 'strong';
    }
  }

  private determineEffectTypes(): void {
    const code = this.weatherCode.slice(0, 2);
    this.effectTypes = [];

    // Określ porę dnia przed wyborem efektów
    this.determineDayTimeEffect();
    const isNight = this.dayTimeEffect === 'night';

    switch (code) {
      case '01': // czyste niebo
        if (isNight) {
          this.effectTypes.push('clear-night');
        } else {
          this.effectTypes.push('sunny');
        }
        break;
      case '02': // lekkie zachmurzenie
        if (isNight) {
          this.effectTypes.push('clear-night');
        } else {
          this.effectTypes.push('sunny');
        }
        this.effectTypes.push('cloudy-light');
        break;
      case '03': // zachmurzenie
        this.effectTypes.push('cloudy-medium');
        break;
      case '04': // duże zachmurzenie
        this.effectTypes.push('cloudy-heavy');
        break;
      case '09': // przelotny deszcz
        this.effectTypes.push('cloudy-heavy');
        this.effectTypes.push('rain-light');
        break;
      case '10': // deszcz
        this.effectTypes.push('cloudy-heavy');
        this.effectTypes.push('rain-heavy');
        break;
      case '11': // burza
        this.effectTypes.push('cloudy-heavy');
        this.effectTypes.push('thunder');
        this.effectTypes.push('rain-heavy');
        break;
      case '13': // śnieg
        this.effectTypes.push('cloudy-medium');
        this.effectTypes.push('snow');
        break;
      case '50': // mgła
        this.effectTypes.push('fog');
        break;
      case '14': // burza śnieżna
        this.effectTypes.push('cloudy-heavy');
        this.effectTypes.push('snow');
        this.effectTypes.push('thunder');
        break;
      case '15': // intensywne opady deszczu
        this.effectTypes.push('cloudy-heavy');
        this.effectTypes.push('rain-heavy');
        this.effectTypes.push('thunder');
        break;
      default:
        break;
    }
  }

  public refreshEffects(): void {
    this.showEffect = false;
    setTimeout(() => {
      this.showEffect = true;
    }, 10);
  }

  private showEffectForDuration(): void {
    this.showEffect = true;

    // Zatrzymaj efekty tylko wtedy, gdy duration jest dodatnie
    if (this.duration > 0) {
      this.clearTimers();
      const timerId = window.setTimeout(() => {
        this.showEffect = false;
      }, this.duration);
      this.animationTimers.push(timerId);
    }
  }

  private clearTimers(): void {
    // Wyczyść wszystkie timery
    this.animationTimers.forEach(timerId => {
      window.clearTimeout(timerId);
    });
    this.animationTimers = [];
  }

  hasEffectType(type: string): boolean {
    return this.effectTypes.includes(type);
  }

  // Metoda do czyszczenia zasobów przy zniszczeniu komponentu
  ngOnDestroy(): void {
    this.clearTimers();
  }
}
