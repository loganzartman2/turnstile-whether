import {useCallback, useEffect, useState} from 'react';
import DailyWeather from './components/DailyWeather';
import {getDayNames, getUpcomingDates} from './date-utils';
import {fetchLocation} from './visualcrossing';

export default function App() {
  const [dayOfWeek, setDayOfWeek] = useState<number>(5);
  const [time, setTime] = useState<string>('Afternoon');
  const [location, setLocation] = useState<string>('Seattle, WA');

  const handleLocationBlur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      (async () => {
        const result = await fetchLocation({location: e.target.value});
        if (result.ok) {
          const json = await result.json();
          setLocation(json.resolvedAddress);
        } else {
          setLocation('');
        }
      })();
    },
    []
  );

  const topbar = (
    <div className="flex flex-row justify-between mb-12">
      <div className="uppercase text-brandPrimary font-bold">whether.io</div>
      <div className="flex flex-row gap-4">
        <div>Help</div>
        <div>Sign Out</div>
      </div>
    </div>
  );

  const locationInput = (
    <input
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      onBlur={handleLocationBlur}
      placeholder="Type a location"
      className=""
    />
  );

  const dayPicker = (
    <select
      value={dayOfWeek}
      onChange={(e) => setDayOfWeek(Number.parseInt(e.target.value))}
    >
      {getDayNames().map((name, i) => (
        <option key={i} value={i} label={name} />
      ))}
    </select>
  );

  const timePicker = (
    <select value={time} onChange={(e) => setTime(e.target.value)}>
      <option>Morning</option>
      <option>Afternoon</option>
      <option>Evening</option>
      <option>Night</option>
    </select>
  );

  const header = (
    <div className="flex md:flex-row flex-col flex-wrap justify-between py-4 px-12 mb-8 border-b-black border-b-2">
      <div className="text-2xl font-semibold">📍 {locationInput}</div>
      <div className="flex flex-row gap-4 text-lg">
        <div>⏰</div>
        <div>Every {dayPicker}</div>
        <div>{timePicker}</div>
      </div>
    </div>
  );

  const upcomingDates = getUpcomingDates({dayOfWeek, count: 3});
  const report = (
    <div className="flex md:flex-row flex-col justify-center gap-10">
      {upcomingDates.map((date) => (
        <DailyWeather date={date} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col m-2">
      {topbar}
      <div className="w-[900px] max-w-full m-auto">
        {header}
        {report}
      </div>
    </div>
  );
}
