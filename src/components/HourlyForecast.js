import React from "react";

const HourlyForecast = ({ hours, unit }) => {
  const formatTemp = (c, f) => {
    const value = unit === "C" ? c : f;
    return Math.round(value);
  };

  const currentHour = new Date().getHours();

  const filteredHours = hours.filter((hour) => {
    const hourTime = new Date(hour.time).getHours();
    return hourTime >= currentHour;
  });

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex gap-6 text-white">
        {filteredHours.map((hour, idx) => {
          const hourLabel = new Date(hour.time).getHours();

          return (
            <div key={idx} className="flex flex-col items-center min-w-[70px]">
              <p className="text-sm font-light opacity-80">{idx === 0 ? "Now" : `${hourLabel}`}</p>

              <img
                src={`https:${hour.condition.icon}`}
                alt=""
                className="w-12 my-2 object-contain my-2"
              />

              <p className="text-base font-light">
                {formatTemp(hour.temp_c, hour.temp_f)}°
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
