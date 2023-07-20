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
  const conditions = `${dayData.conditions} ${dayData.temp.toFixed(0)}°F`;
  const wind = `${dayData.windspeed.toFixed(0)} mph`;
  const precip =
    dayData.precip > 0
      ? `${dayData.precip.toFixed(2)}" precipitation`
      : 'no precipitation';

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl mb-3">{formatDay(date)}</div>
      <div className="flex flex-row items-center mb-6">
        <div className="text-7xl mr-2">☀️</div>
        <div className="flex flex-col">
          <div className="text-xl">{conditions}</div>
          <div className="text-lg">🌬️ {wind}</div>
          <div className="text-lg">💦 {precip}</div>
        </div>
      </div>
      <div className="w-[450px] h-[380px]">{plot}</div>
    </div>
  );
}
