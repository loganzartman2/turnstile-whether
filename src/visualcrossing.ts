/**
 * Attributes we need:
 * - Daily conditions
 * - Daily temperature
 * - Daily wind speed
 * - Daily precipitation
 * maybe these attributes should be hourly, and we should aggregate them
 * manually over the time window provided?
 *
 * - Hourly temperature
 * - Hourly wind
 * - Hourly rain
 */

import {format} from 'date-fns';

const API_KEY = process.env.API_KEY;
if (API_KEY === undefined)
  throw new Error(
    'Missing API key. Create a file called .env in the top level directory, and add: API_KEY=your_api_key_here'
  );

const formatDateAPI = (date: Date): string => format(date, 'yyyy-MM-dd');

const getUrl = ({
  location,
  elements,
  include,
  startDay,
  endDay,
}: {
  location: string;
  elements?: string[];
  include?: string[];
  startDay?: Date;
  endDay?: Date;
}): string => {
  const url = new URL(
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'
  );
  url.pathname += `/${encodeURIComponent(location)}`;
  if (startDay) {
    url.pathname += `/${formatDateAPI(startDay)}`;
    if (endDay) url.pathname += `/${formatDateAPI(endDay)}`;
  }
  if (elements) url.searchParams.set('elements', elements.join(','));
  if (include) url.searchParams.set('include', include.join(','));
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('contentType', 'json');
  return url.toString();
};

export const fetchLocation = async ({location}: {location: string}) =>
  fetch(
    getUrl({
      location,
      elements: ['resolvedAddress'],
      include: [],
    }),
    {method: 'GET'}
  );

export const fetchDailyWeather = async ({
  location,
  date,
}: {
  location: string;
  date: Date;
}) =>
  fetch(
    getUrl({
      location,
      startDay: date,
      elements: [
        'datetime',
        'datetimeEpoch',
        'temp',
        'humidity',
        'precip',
        'preciptype',
        'windspeed',
        'conditions',
        'icon',
      ],
      include: ['hours', 'days'],
    }),
    {method: 'GET'}
  );
