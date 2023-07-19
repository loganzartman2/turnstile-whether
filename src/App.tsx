import DailyWeather from './components/DailyWeather';

export default function App() {
  const topbar = (
    <div className="flex flex-row justify-between mb-12">
      <div className="uppercase text-brandPrimary font-bold">whether.io</div>
      <div className="flex flex-row gap-4">
        <div>Help</div>
        <div>Sign Out</div>
      </div>
    </div>
  );

  const header = (
    <div className="flex md:flex-row flex-col flex-wrap justify-between py-4 px-12 mb-8 border-b-black border-b-2">
      <div className="text-2xl font-semibold">📍 Seattle, WA</div>
      <div className="flex flex-row gap-4 text-lg">
        <div>⏰</div>
        <div>Every Friday</div>
        <div>Afternoon</div>
      </div>
    </div>
  );

  const report = (
    <div className="flex md:flex-row flex-col justify-center gap-10">
      <DailyWeather />
      <DailyWeather />
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
