import {useCallback, useMemo, useState} from 'react';
import DailyWeather from './components/DailyWeather';
import {TimeOfDay, getDayNames, getUpcomingDates} from './date-utils';
import {fetchLocation} from './visualcrossing';

export default function App() {
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [dayOfWeek, setDayOfWeek] = useState<number>(5);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
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
      <select
        value={timeOfDay}
        onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
        className="capitalize"
      >
        <option>morning</option>
        <option>afternoon</option>
        <option>evening</option>
      </select>
    ),
    [timeOfDay]
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

  const upcomingDates = useMemo(
    () => getUpcomingDates({dayOfWeek, weekOffset, count: 2}),
    [dayOfWeek, weekOffset]
  );

  const report = useMemo(
    () => (
      <div className="grid grid-cols-[1fr auto 1fr] grid-rows-[auto 1fr] bottom-0">
        <div className="col-span-3 col-start-1 md:col-span-1 md:col-start-2 md:col-end-3 row-start-1 row-end-2 flex md:flex-row flex-col flex-wrap justify-center gap-10">
          {upcomingDates.map((date, i) => (
            <DailyWeather
              key={i}
              primary={i + weekOffset === 0}
              location={resolvedLocation}
              date={date}
              timeOfDay={timeOfDay}
            />
          ))}
        </div>
        <button
          onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
          className="fixed bottom-0 left-0 right-[50%] h-16 bg-white md:h-auto md:bg-none md:relative md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 text-2xl"
        >
          ❮
        </button>
        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          className="fixed bottom-0 left-[50%] right-0 h-16 bg-white md:h-auto md:bg-none md:relative md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2 text-2xl"
        >
          ❯
        </button>
      </div>
    ),
    [resolvedLocation, timeOfDay, upcomingDates, weekOffset]
  );

  return (
    <div className="flex flex-col m-2">
      {topbar}
      <div className="w-[1000px] max-w-full m-auto pb-16">
        {header}
        {resolvedLocation && report}
      </div>
    </div>
  );
}
