export const rooms = [
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

export const actuated = ['light', 'offTimer', 'scheduledRamp'] as const;

export const measuredCategories = {
  airQuality: ['temperature', 'relativeHumidity', 'pressure'],
  airSafety: ['co2', 'pm025', 'pm10'],
  environmental: ['brightness', 'uvIndex'],
  security: ['motion', 'open'],
} as const;
