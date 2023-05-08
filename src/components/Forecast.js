import React from "react";

const getIconUrl = (day) => {
  const iconCode = day.weather.icon;
  return `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;
};

function Forecast({ data }) {
  return (
    <div>
      <div className="flex flex-row items-center justify-between text-white">
        {data.slice(1, 6).map((day) => (
          <div key={day.datetime}>
            <p className="font-light text-sm">
              {new Date(day.valid_date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>
            <img src={getIconUrl(data[0])} alt="" className="w-10" />
            <p className="font-medium">{day.temp.toFixed()}&deg;C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
