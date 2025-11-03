# WeatherAppApi

This project is a weather application built with Angular that provides current weather information, 5-day forecasts, air quality data, and interactive weather maps for any location worldwide.

## Features

- 🌍 **Multi-language Support**: Available in English and Polish
- 🗺️ **Interactive Maps**: View weather layers including clouds, precipitation, pressure, wind, and temperature
- 🌤️ **Current Weather**: Real-time weather data with detailed information
- 📅 **5-Day Forecast**: Hourly forecasts organized by day
- 💨 **Air Quality**: Air pollution data with AQI ratings
- 🕐 **Time Zones**: Display local time for selected locations
- 🔍 **Smart Search**: Location search with autocomplete

## Language Support

The application supports two languages:
- **Polish (Polski)** - Default language
- **English** - Available through the language switcher in the header

Users can switch between languages at any time using the language toggle buttons in the header. The selected language is automatically saved and persisted across sessions.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Internationalization (i18n)

The application uses a custom runtime translation system for multi-language support:

- **LocaleService**: Manages language selection and provides translations
- **TranslatePipe**: Angular pipe for translating text in templates
- **Supported Languages**: Polish (`pl`) and English (`en`)
- **Persistence**: Selected language is saved in browser's localStorage

To add a new language:

1. Add translations to the `translations` object in `src/app/locale.service.ts`
2. Update the `SupportedLanguage` type if needed
3. Add language selection button in the header

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
