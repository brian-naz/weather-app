import React, { useState } from "react";
import axios from "axios";
import Forecast from "./Forecast";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AirIcon from "@mui/icons-material/Air";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import { Button, Fade } from "@mui/material";
import HourlyForecast from "./HourlyForecast"; 


const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem("tempUnit") || "C";
  });
  const API_KEY = "26dc33589eb94455928200533252903"; 
  const getIconUrl = (condition) => {
    return `https:${condition.icon}`;
  };

  const formatBackground = (condition, temp) => {
    if (!condition) return "from-cyan-700 to-blue-700";

    if (condition.toLowerCase().includes("cloud")) {
      return "from-gray-400 to-black";
    }
    if (condition.toLowerCase().includes("rain")) {
      return "from-blue-900 to-black";
    }
    if (temp < 15) {
      return "from-cyan-500 to-blue-700";
    }
    return "from-yellow-500 to-orange-700";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=no&alerts=no`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  const toggleUnit = () => {
    const newUnit = unit === "C" ? "F" : "C";
    setUnit(newUnit);
    localStorage.setItem("tempUnit", newUnit);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-around my-6">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-around my-6">{error}</div>;
  }

  if (!weatherData) {
    return (
      <div
        className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400`}
      >
        <div className="flex items-center justify-around my-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row items-center justify-center space-x-4">
              <input
                type="text"
                placeholder="Search"
                value={location}
                onChange={handleChange}
                className="text-xl text-black font-light p-2 w-50 shadow-xl focus:outline-none"
              />
              <Button type="submit">
                <SearchIcon className="text-white cursor-pointer" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const current = weatherData.current;
  const forecast = weatherData.forecast.forecastday;
  const condition = current.condition.text;
  const icon = getIconUrl(current.condition);
  const temp = current.temp_c;

  return (
    <Fade in={handleChange}>
      <div
        className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground(
          condition,
          temp
        )}`}
      >
        <div className="flex items-center justify-around my-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row items-center justify-center space-x-4">
              <input
                type="text"
                placeholder="Search"
                value={location}
                onChange={handleChange}
                className="text-xl text-black font-light p-2 w-50 shadow-xl focus:outline-none"
              />
              <Button type="submit">
                <SearchIcon className="text-white cursor-pointer" />
              </Button>
            </div>
          </form>
        </div>

        <Button
  variant="outlined"
  onClick={toggleUnit}
  size="small"
  sx={{
    color: unit === "C" ? "lightblue" : "orange",
    borderColor: "white",
    minWidth: "30px",
    padding: "4px 8px",
    fontSize: "12px",
    marginLeft: "10px",
    fontWeight: "bold",
  }}
>
  °{unit === "C" ? "F" : "C"}
</Button>


        <div className="flex flex-col items-center text-white py-3">
        <h1>{weatherData.location.name}, {weatherData.location.region}</h1>
          <div className="flex items-center space-x-4">          
            <img src={current.condition.icon} alt={current.condition.text} className="w-16" />
            <p className="text-5xl">
  {unit === "C" ? current.temp_c.toFixed() : current.temp_f.toFixed()}°{unit}
</p>
          </div>
          <p className="text-xl mt-2">{current.condition.text}</p>
        </div>

        <div className="flex flex-row justify-between text-white">
          <div className="flex font-light text-sm items-center justify-center">
            <WbSunnyIcon className="mr-1" />
            Low: {forecast[0].day.mintemp_c}&deg;C
          </div>
          <div className="flex font-light text-sm items-center justify-center">
            <WbSunnyIcon className="mr-1" />
            High: {forecast[0].day.maxtemp_c}&deg;C
          </div>
          <div className="flex font-light text-sm items-center justify-center">
            <ThermostatIcon className="mr-1" />
            Feels like: {current.feelslike_c}&deg;C
          </div>
          <div className="flex font-light text-sm items-center justify-center">
            <OpacityIcon className="mr-1" />
            Humidity: {current.humidity}%
          </div>
        </div>

        <br />
        <Forecast forecast={forecast} unit={unit} />
        <HourlyForecast hours={forecast[0].hour} unit={unit} />
      </div>
    </Fade>
  );
};

export default Weather;