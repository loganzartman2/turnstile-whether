import {useCallback, useMemo, useState} from 'react';
import DailyWeather from './components/DailyWeather';
import {getDayNames, getUpcomingDates} from './date-utils';
import {fetchLocation} from './visualcrossing';

export default function App() {
  const [dayOfWeek, setDayOfWeek] = useState<number>(5);
  const [time, setTime] = useState<string>('Afternoon');
  const [inputLocation, setInputLocation] = useState<string>('Seattle, WA');
  const [resolvedLocation, setResolvedLocation] =
    useState<string>(inputLocation);

  const handleLocationBlur = useCallback((e: {target: {value: string}}) => {
    (async () => {
      const newLocation = e.target.value;
      if (newLocation !== '') {
        const result = await fetchLocation({location: newLocation});
        if (result.ok) {
          const json = await result.json();
          setResolvedLocation(json.resolvedAddress);
          setInputLocation(json.resolvedAddress);
        } else {
          setResolvedLocation('');
          setInputLocation('');
        }
      }
    })();
  }, []);

  const topbar = useMemo(
    () => (
      <div className="flex flex-row justify-between mb-12">
        <div className="uppercase text-brandPrimary font-bold">whether.io</div>
        <div className="flex flex-row gap-4">
          <div>Help</div>
          <div>Sign Out</div>
        </div>
      </div>
    ),
    []
  );

  const locationInput = useMemo(
    () => (
      <input
        type="text"
        value={inputLocation}
        onChange={(e) => setInputLocation(e.target.value)}
        onBlur={handleLocationBlur}
        placeholder="Type a location"
        className=""
      />
    ),
    [handleLocationBlur, inputLocation]
  );

  const dayPicker = useMemo(
    () => (
      <select
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(Number.parseInt(e.target.value))}
      >
        {getDayNames().map((name, i) => (
          <option key={i} value={i} label={name} />
        ))}
      </select>
    ),
    [dayOfWeek]
  );

  const timePicker = useMemo(
    () => (
      <select value={time} onChange={(e) => setTime(e.target.value)}>
        <option>Morning</option>
        <option>Afternoon</option>
        <option>Evening</option>
        <option>Night</option>
      </select>
    ),
    [time]
  );

  const header = useMemo(
    () => (
      <div className="flex md:flex-row flex-col flex-wrap justify-between gap-x-10 gap-y-4 py-4 md:px-12 px-2 mb-8 border-b-black border-b-2">
        <div className="text-2xl font-semibold">📍 {locationInput}</div>
        <div className="flex flex-row gap-2 text-lg">
          <div>⏰</div>
          <div>Every {dayPicker}</div>
          <div>{timePicker}</div>
        </div>
      </div>
    ),
    [dayPicker, locationInput, timePicker]
  );

  const report = useMemo(() => {
    const upcomingDates = getUpcomingDates({dayOfWeek, count: 3});
    return (
      <div className="flex md:flex-row flex-col flex-wrap justify-center gap-10">
        {upcomingDates.map((date, i) => (
          <DailyWeather
            key={date.toString()}
            primary={i === 0}
            location={resolvedLocation}
            date={date}
          />
        ))}
      </div>
    );
  }, [dayOfWeek, resolvedLocation]);

  return (
    <div className="flex flex-col m-2">
      {topbar}
      <div className="w-[1000px] max-w-full m-auto">
        {header}
        {resolvedLocation && report}
      </div>
    </div>
  );
}
