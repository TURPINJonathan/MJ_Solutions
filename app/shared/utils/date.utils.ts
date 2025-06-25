export type DateFormat =
  | 'short'         // 24/06/2025
  | 'long'          // 24 juin 2025, 14:10
  | 'iso'           // 2025-06-24T14:10:29
  | 'time'          // 14:10
  | 'weekdayShort'  // mar. 24/06/2025
  | 'weekdayLong';  // mardi 24 juin 2025

export function formatDate(
  date: string | Date,
  format: DateFormat = 'short',
  locale: string = 'fr'
): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return date.toString();

  const loc = locale.startsWith('en') ? 'en-GB' : 'fr-FR';

  switch (format) {
    case 'short':
      return d.toLocaleDateString(loc);
    case 'long':
      return d.toLocaleDateString(loc, { day: '2-digit', month: 'long', year: 'numeric' }) +
        ', ' + d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
    case 'iso':
      return d.toISOString().slice(0, 19);
    case 'time':
      return d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
    case 'weekdayShort':
      return d.toLocaleDateString(loc, { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    case 'weekdayLong':
      return d.toLocaleDateString(loc, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    default:
      return d.toLocaleDateString(loc);
  }
}