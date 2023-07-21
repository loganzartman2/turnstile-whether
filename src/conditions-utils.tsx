// https://www.visualcrossing.com/resources/documentation/weather-api/defining-icon-set-in-the-weather-api/
export const getConditionsIcon = (name: string | null): React.ReactNode => {
  switch (name) {
    case 'snow':
      return <span>🌨️</span>;
    case 'rain':
      return <span>🌧️</span>;
    case 'fog':
      return <span>🌫️</span>;
    case 'wind':
      return <span>💨</span>;
    case 'cloudy':
      return <span>☁️</span>;
    case 'partly-cloudy-day':
    case 'partly-cloudy-night':
      return <span>🌥️</span>;
    case 'clear-day':
    case 'clear-night':
      return <span>☀️</span>;
    default:
      return <span>❔</span>;
  }
};

export const formatConditions = (
  conditions: string | null,
  temp: number | null
): string => {
  if (!conditions) {
    return 'No data';
  }
  if (!temp) {
    return conditions;
  }
  return `${conditions} ${temp.toFixed(0)}°F`;
};

// https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/#:~:text=0%25%20to%20100%25-,preciptype,-%E2%80%93%20an%20array%20indicating
export const getPrecipIcon = (preciptype: string[] | null): React.ReactNode => {
  if (!preciptype) {
    return <span>☀️</span>;
  }
  if (preciptype.includes('freezingrain') || preciptype.includes('ice')) {
    return <span>🧊</span>;
  }
  if (preciptype.includes('snow')) {
    return <span>❄️</span>;
  }
  return <span>💧</span>;
};

export const formatPrecipitation = (
  amount: number,
  preciptype: string[] | null
): string => {
  if (preciptype) {
    const amountStr = `${amount.toFixed(2)}"`;
    const desc = [];
    if (preciptype.includes('freezingrain')) desc.push('freezing rain');
    if (preciptype.includes('ice')) desc.push('ice');
    if (preciptype.includes('snow')) desc.push('snow');
    if (preciptype.includes('rain')) desc.push('rain');
    return `${amountStr} ${desc.join(', ')}`;
  } else {
    return 'no precipitation';
  }
};

export const formatWinds = (windspeed: number | null): string => {
  if (!windspeed) {
    return 'no wind data';
  }
  if (windspeed > 0) {
    return `winds ${windspeed.toFixed(0)} mph`;
  }
  return `no wind`;
};
