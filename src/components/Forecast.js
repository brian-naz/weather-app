import React from "react";

function Forecast({ forecast, unit }) {
  const formatTemp = (c, f) => {
    const value = unit === "C" ? c : f;
    return Math.round(value);
  };

  const allMins = forecast.map((day) =>
    unit === "C" ? day.day.mintemp_c : day.day.mintemp_f,
  );

  const allMaxes = forecast.map((day) =>
    unit === "C" ? day.day.maxtemp_c : day.day.maxtemp_f,
  );

  const overallMin = Math.min(...allMins);
  const overallMax = Math.max(...allMaxes);
  const overallRange = overallMax - overallMin;

  return (
    <div className="text-white">
      <p className="text-xs tracking-widest opacity-70 mb-4">3-DAY FORECAST</p>

      {forecast.map((day, index) => {
        const weekday = new Date(day.date).toLocaleDateString("en-US", {
          weekday: "short",
        });

        const min = unit === "C" ? day.day.mintemp_c : day.day.mintemp_f;
        const max = unit === "C" ? day.day.maxtemp_c : day.day.maxtemp_f;

        const minPosition = ((min - overallMin) / overallRange) * 100;
        const maxPosition = ((max - overallMin) / overallRange) * 100;

        return (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-white/10 last:border-none"
          >
            <p className="w-1/4 font-light">{weekday}</p>

            <img
              src={`https:${day.day.condition.icon}`}
              alt=""
              className="w-8"
            />

            <span className="opacity-70 w-10 text-right">
              {formatTemp(day.day.mintemp_c, day.day.mintemp_f)}°
            </span>
            
            <div className="relative flex-1 mx-3 h-1 bg-white/20 rounded-full">
              <div
                className="absolute h-1 bg-white rounded-full"
                style={{
                  left: `${minPosition}%`,
                  width: `${maxPosition - minPosition}%`,
                }}
              />
            </div>

            <span className="w-10 text-left">
              {formatTemp(day.day.maxtemp_c, day.day.maxtemp_f)}°
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default Forecast;
