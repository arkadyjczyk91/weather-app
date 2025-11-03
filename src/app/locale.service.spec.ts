import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(LocaleService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to Polish language', () => {
    expect(service.language).toBe('pl');
  });

  it('should change language to English', () => {
    service.setLanguage('en');
    expect(service.language).toBe('en');
  });

  it('should persist language in localStorage', () => {
    service.setLanguage('en');
    expect(localStorage.getItem('weatherAppLang')).toBe('en');
  });

  it('should translate Polish keys correctly', () => {
    service.setLanguage('pl');
    expect(service.translate('app.title')).toBe('Pogoda');
    expect(service.translate('search.button')).toBe('Sprawdź pogodę');
  });

  it('should translate English keys correctly', () => {
    service.setLanguage('en');
    expect(service.translate('app.title')).toBe('Weather');
    expect(service.translate('search.button')).toBe('Check Weather');
  });

  it('should return key if translation not found', () => {
    expect(service.translate('non.existent.key')).toBe('non.existent.key');
  });

  it('should return correct locale code for Polish', () => {
    service.setLanguage('pl');
    expect(service.getLocaleCode()).toBe('pl-PL');
  });

  it('should return correct locale code for English', () => {
    service.setLanguage('en');
    expect(service.getLocaleCode()).toBe('en-US');
  });

  it('should load saved language from localStorage', () => {
    localStorage.setItem('weatherAppLang', 'en');
    const newService = new LocaleService();
    expect(newService.language).toBe('en');
  });
});
