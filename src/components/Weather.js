import React, { useState } from "react";
import axios from "axios";
import { API_KEY } from "./config";
import Forecast from "./Forecast";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AirIcon from "@mui/icons-material/Air";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import { Button, Fade } from "@mui/material";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getIconUrl = (day) => {
    const iconCode = day.weather.icon;
    return `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;
  };

  const formatBackground = () => {
    if (!weatherData) return "from-cyan-700 to-blue-700";
    const threshold = 30;
    if (data[0].weather.description.includes("cloud")) {
      return "from-gray-400 to-black";
    }
    if (data[0].weather.description.includes("rain")) {
      return "from-blue-900 to-black";
    }
    if (data[0].temp < threshold) {
      return "from-cyan-500 to-blue-700";
    }
    return "from-yellow-500 to-orange-700";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&key=${API_KEY}&days=6`
      );
      setWeatherData(response.data);
      setLoading(false);
      setError("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-around my-6">
        <CircularProgress />;
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-around my-6">{error}</div>;
  }

  if (!weatherData) {
    return (
      <div
        className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
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

  const { city_name, country_code, data, minutely } = weatherData;

  return (
    <Fade in={handleChange}>
      <div
        className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
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

        <div className="flex flex-row items-center justify-center text-white py-3">
          <img src={getIconUrl(data[0])} alt="" className="w-20" />
          <div className="flex flex-col items-center text-white py-3 p-10">
            <h2 className="text-2xl font-bold mb-4">
              {city_name}, {country_code}
            </h2>
            <p className="text-5xl">{data[0].temp.toFixed()}&deg;C</p>
            <div className="flex items-center justify-center py-3 text-xl text-white">
              {data[0].weather.description}
            </div>
          </div>
          <div className="flex flex-col justify-between"></div>
        </div>
        <div>
          <div className="flex flex-row justify-between text-white">
            <div className="flex font-light text-sm items-center justify-center">
              <WbSunnyIcon className="mr-1" />
              Low: {data[0].low_temp.toFixed()}&deg;C
            </div>
            <div className="flex font-light text-sm items-center justify-center">
              <WbSunnyIcon className="mr-1" />
              High: {data[0].max_temp.toFixed()}&deg;C
            </div>
            <div className="flex font-light text-sm items-center justify-center">
              <ThermostatIcon className="mr-1" />
              Feels like: {data[0].app_max_temp.toFixed()}&deg;C
            </div>
            <div className="flex font-light text-sm items-center justify-center">
              <OpacityIcon className="mr-1" />
              Humidity: {data[0].rh}%
            </div>
          </div>
        </div>
        <br></br>
        <Forecast data={data} />
      </div>
    </Fade>
  );
};

export default Weather;
