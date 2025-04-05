import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherEffectComponent } from './weather-effect.component';

describe('WeatherEffectComponent', () => {
  let component: WeatherEffectComponent;
  let fixture: ComponentFixture<WeatherEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherEffectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
