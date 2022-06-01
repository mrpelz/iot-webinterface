export const roomSorting = [
  'livingRoom',
  'diningRoom',
  'kitchen',
  'bedroom',
  'office',
  'showerBathroom',
  'bathtubBathroom',
  'storageRoom',
  'hallway',
] as const;

export const actuated = ['lighting'] as const;

export const measuredCategories = {
  airQuality: ['temperature', 'relativeHumidity'],
  airSafety: ['pm025', 'pm10', 'co2'],
  environmental: ['brightness', 'uvIndex', 'pressure'],
  security: ['motion'],
} as const;

export const defaultNumberFormat: Intl.NumberFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  minimumIntegerDigits: 1,
};

export const measuredNumberFormats: Record<string, Intl.NumberFormatOptions> = {
  brightness: defaultNumberFormat,
  co2: {
    ...defaultNumberFormat,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  },
  pm025: defaultNumberFormat,
  pm10: defaultNumberFormat,
  pressure: {
    ...defaultNumberFormat,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  },
  relativeHumidity: defaultNumberFormat,
  temperature: defaultNumberFormat,
  uvIndex: {
    ...defaultNumberFormat,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  },
};
