import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { LocaleService } from './locale.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let localeService: LocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocaleService]
    });
    localStorage.clear();
    localeService = TestBed.inject(LocaleService);
    pipe = new TranslatePipe(localeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate Polish text', () => {
    localeService.setLanguage('pl');
    expect(pipe.transform('app.title')).toBe('Pogoda');
  });

  it('should translate English text', () => {
    localeService.setLanguage('en');
    expect(pipe.transform('app.title')).toBe('Weather');
  });

  it('should return key if translation not found', () => {
    expect(pipe.transform('unknown.key')).toBe('unknown.key');
  });
});
