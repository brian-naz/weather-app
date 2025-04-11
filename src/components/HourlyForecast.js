import React from "react";
import { Typography } from "@mui/material";

const HourlyForecast = ({ hours, unit }) => {
  return (
    <div className="overflow-x-scroll whitespace-nowrap py-4">
      <div className="flex gap-4 text-white">
        {hours.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[70px]">
            <Typography variant="body1" sx={{ color: "white" }}>
              {new Date(hour.time).getHours()}:00
            </Typography>
            <img
              src={`https:${hour.condition.icon}`}
              alt=""
              style={{ width: "40px", margin: "0 auto" }}
            />
            <Typography variant="body1" sx={{ color: "white" }}>
              {unit === "C" ? hour.temp_c : hour.temp_f}°{unit}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
