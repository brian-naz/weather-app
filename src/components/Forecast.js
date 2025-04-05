import React from "react";

const getIconUrl = (condition) => {
  return `https:${condition.icon}`;
};

function Forecast({ forecast, unit }) {
  return (
    <div>
      <div className="flex flex-row items-center justify-between text-white">
        {forecast.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <p className="font-light text-sm">
              {new Date(day.date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>
            <img
              src={`https:${day.day.condition.icon}`}
              alt={day.day.condition.text}
              className="w-10"
            />
            <p className="font-medium">{unit === "C"
                ? day.day.avgtemp_c.toFixed()
                : day.day.avgtemp_f.toFixed()}
              °{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;