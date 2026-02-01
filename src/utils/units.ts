export function toDisplayTemp(tempC: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function tempSuffix(unit: 'celsius' | 'fahrenheit'): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}
