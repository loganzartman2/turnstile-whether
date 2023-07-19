export default function DailyWeather() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl mb-3">This Friday the 15th</div>
      <div className="flex flex-row items-center mb-6">
        <div className="text-7xl mr-2">☀️</div>
        <div className="flex flex-col">
          <div className="text-xl">Sunny 71°F</div>
          <div className="text-lg">🌬️ winds 5mph</div>
          <div className="text-lg">💦 no rain</div>
        </div>
      </div>
      <div>Plot goes here!</div>
    </div>
  );
}
