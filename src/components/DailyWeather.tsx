import {formatDay} from '@/date-utils';
import {fetchDailyWeather} from '@/visualcrossing';
import {useEffect, useState} from 'react';
import colors from 'tailwindcss/colors';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import clsx from 'clsx';

// https://www.visualcrossing.com/resources/documentation/weather-api/defining-icon-set-in-the-weather-api/
const getConditionsIcon = (name: string | null): React.ReactNode => {
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

const formatConditions = (
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
const getPrecipIcon = (preciptype: string[] | null): React.ReactNode => {
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

const formatPrecipitation = (
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

const formatWinds = (windspeed: number | null): string => {
  if (!windspeed) {
    return 'no wind data';
  }
  if (windspeed > 0) {
    return `winds ${windspeed.toFixed(0)} mph`;
  }
  return `no wind`;
};

export default function DailyWeather({
  primary,
  location,
  date,
}: {
  primary: boolean;
  location: string;
  date: Date;
}) {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const response = await fetchDailyWeather({location, date});
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        setWeatherData(json);
        setLoading(false);
      } else {
        throw new Error(await response.text());
      }
    })();
  }, [location, date]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const plot = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={weatherData.days[0].hours}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datetime" />
        <YAxis yAxisId="mainAxis" />
        <YAxis yAxisId="precipAxis" orientation="right" domain={[0, 0.5]} />
        <Tooltip
          animationDuration={200}
          allowEscapeViewBox={{x: true, y: true}}
          wrapperStyle={{zIndex: 100}}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="temp"
          name="Temperature (°F)"
          yAxisId="mainAxis"
          dot={false}
          stroke={colors.red[600]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="humidity"
          name="Humidity %"
          yAxisId="mainAxis"
          dot={false}
          stroke={colors.slate[600]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="precip"
          name="Precipitation (in)"
          yAxisId="precipAxis"
          dot={false}
          stroke={colors.blue[600]}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const dayData = weatherData.days[0];
  const conditionsIcon = getConditionsIcon(dayData.icon);
  const conditions = formatConditions(dayData.conditions, dayData.temp);
  const wind = formatWinds(dayData.windspeed);
  const precipIcon = getPrecipIcon(dayData.preciptype);
  const precip = formatPrecipitation(dayData.precip, dayData.preciptype);

  return (
    <div className="flex flex-col items-center max-w-full">
      <div
        className={clsx(
          'mb-3 text-2xl font-semibold',
          primary && 'text-brandPrimary'
        )}
      >
        {formatDay(date)}
      </div>
      <div className="flex flex-row items-center mb-6">
        <div className="text-7xl mr-2">️{conditionsIcon}</div>
        <div className="flex flex-col">
          <div className="text-xl">{conditions}</div>
          <div className="text-lg">🌬️ {wind}</div>
          <div className="text-lg">
            {precipIcon} {precip}
          </div>
        </div>
      </div>
      <div className="w-[450px] max-w-full h-[300px]">{plot}</div>
    </div>
  );
}
