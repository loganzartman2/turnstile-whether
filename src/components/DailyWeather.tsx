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

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

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
  location,
  date,
}: {
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
      <LineChart width={500} height={300} data={weatherData.days[0].hours}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datetime" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temp" stroke={colors.red[600]} />
        <Line type="monotone" dataKey="humidity" stroke={colors.slate[600]} />
        <Line type="monotone" dataKey="precip" stroke={colors.blue[600]} />
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
    <div className="flex flex-col items-center">
      <div className="text-2xl mb-3">{formatDay(date)}</div>
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
      <div className="w-[450px] h-[380px]">{plot}</div>
    </div>
  );
}
