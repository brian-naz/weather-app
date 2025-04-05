import React from "react";

const HourlyForecast = ({ hours, unit }) => {
  return (
    <div className="overflow-x-scroll whitespace-nowrap py-4">
      <div className="flex gap-4 text-white">
        {hours.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[70px]">
            <p className="text-sm">
              {new Date(hour.time).getHours()}:00
            </p>
            <img
              src={`https:${hour.condition.icon}`}
              alt=""
              className="w-8 h-8"
            />
            <p className="text-sm">{unit === "C" ? hour.temp_c : hour.temp_f}°{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;