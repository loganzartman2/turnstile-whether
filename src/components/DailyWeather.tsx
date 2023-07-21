import {
  TimeOfDay,
  currentDate,
  formatDay,
  formatTime,
  hourOfToday,
  parseTime,
  timeOfDayToHourRange,
} from '@/date-utils';
import {fetchDailyWeather} from '@/visualcrossing';
import {useCallback, useEffect, useMemo, useState} from 'react';
import colors from 'tailwindcss/colors';
import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import clsx from 'clsx';
import {addHours} from 'date-fns';
import {
  getConditionsIcon,
  formatConditions,
  formatWinds,
  getPrecipIcon,
  formatPrecipitation,
} from '@/conditions-utils';

export default function DailyWeather({
  primary,
  location,
  date,
  timeOfDay,
}: {
  primary: boolean;
  location: string;
  date: Date;
  timeOfDay: TimeOfDay;
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

  const timeFormatter = useCallback((date: Date) => formatTime(date), []);

  const timeOfDayRange = useMemo(() => {
    const range = timeOfDayToHourRange(timeOfDay);
    const startTime = hourOfToday(range[0]).getTime();
    const endTime = hourOfToday(range[1]).getTime();
    return [startTime, endTime];
  }, [timeOfDay]);

  const timeOfDayViewRange = useMemo(() => {
    return [
      addHours(timeOfDayRange[0], -2).getTime(),
      addHours(timeOfDayRange[1], 2).getTime(),
    ];
  }, [timeOfDayRange]);

  const data = useMemo(() => {
    if (!weatherData?.days) {
      return null;
    }
    const today = currentDate();
    return weatherData.days[0].hours
      .map(({datetime, ...rest}: {datetime: string}) => ({
        // we use the time string instead of epoch to avoid timezone conversion
        datetime: parseTime(today, datetime).getTime(),
        ...rest,
      }))
      .filter(
        ({datetime}: {datetime: number}) =>
          datetime >= timeOfDayViewRange[0] && datetime <= timeOfDayViewRange[1]
      );
  }, [timeOfDayViewRange, weatherData?.days]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const plot = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          xAxisId="xAxis"
          dataKey="datetime"
          tickFormatter={timeFormatter}
          minTickGap={10}
        />
        <YAxis yAxisId="mainAxis" />
        <YAxis yAxisId="precipAxis" orientation="right" domain={[0, 0.5]} />
        <Tooltip
          animationDuration={200}
          allowEscapeViewBox={{x: true, y: true}}
          wrapperStyle={{zIndex: 100}}
          labelFormatter={timeFormatter}
        />
        <Legend />
        <ReferenceLine
          xAxisId="xAxis"
          yAxisId="mainAxis"
          x={timeOfDayRange[0]}
          stroke={colors.slate[400]}
          strokeDasharray={'3 3'}
        />
        <ReferenceLine
          xAxisId="xAxis"
          yAxisId="mainAxis"
          x={timeOfDayRange[1]}
          stroke={colors.slate[400]}
          strokeDasharray={'3 3'}
        />
        <Line
          type="monotone"
          dataKey="temp"
          name="Temperature (°F)"
          xAxisId="xAxis"
          yAxisId="mainAxis"
          dot={false}
          stroke={colors.red[600]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="humidity"
          name="Humidity %"
          xAxisId="xAxis"
          yAxisId="mainAxis"
          dot={false}
          stroke={colors.slate[600]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="precip"
          name="Precipitation (in)"
          xAxisId="xAxis"
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
