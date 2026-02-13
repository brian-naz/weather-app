import React, { useState, useEffect } from "react";
import axios from "axios";
import Forecast from "./Forecast";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Fade, Switch } from "@mui/material";
import { Typography, TextField, IconButton } from "@mui/material";
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

  const formatBackground = (condition, temp) => {
  if (!condition) return "from-cyan-700 to-blue-700";

  const c = condition.toLowerCase();

  if (c.includes("rain")) {
    return "from-gray-800 via-blue-900 to-black animate-rain";
  }

  if (c.includes("cloud")) {
    return "from-gray-400 via-gray-600 to-gray-800 animate-cloud";
  }

  if (c.includes("snow")) {
    return "from-blue-200 via-white to-blue-400 animate-snow";
  }

  if (temp < 15) {
    return "from-cyan-500 via-blue-700 to-indigo-900 animate-cold";
  }

  return "from-sky-500 via-blue-500 to-blue-700 animate-sky";
};

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity") || "New York";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        setLocation(savedCity);
        fetchWeatherByCity(savedCity);
      }
    );
  } else {
    setLocation(savedCity);
    fetchWeatherByCity(savedCity);
  }
}, []);

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
      );
      setWeatherData(response.data);
      setLoading(false);
      setError("");
      localStorage.setItem("lastCity", city);
    } catch (error) {
      setLoading(false);
      setError("Unable to fetch weather for the city.");
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
      );
      setWeatherData(response.data);
      setLocation(response.data.location.name);
      setLoading(false);
      setError("");
      localStorage.setItem("lastCity", response.data.location.name);
    } catch (error) {
      setLoading(false);
      setError("Unable to fetch weather by location.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchWeatherByCity(location);
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

  const current = weatherData.current;
  const forecast = weatherData.forecast.forecastday;
  const condition = current.condition.text;
  const temp = current.temp_c;

  return (
      <Fade in={handleChange}>
        <div className="relative min-h-[100dvh] w-full overflow-hidden">
        <div
          className={`absolute inset-0 min-h-[100dvh] w-full py-5 px-6 sm:px-8 md:px-32 
          transition-all duration-1000 ease-in-out
          bg-gradient-to-br ${formatBackground(condition, temp)}`}
        >
          <div className="flex items-center justify-around my-6">
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                hiddenLabel
                fullWidth
                variant="standard"
                placeholder="Search"
                value={location}
                onChange={handleChange}
                InputProps={{
                  style: {
                    color: "white",
                  },
                }}
              />
              <IconButton type="submit" aria-label="search" sx={{ ml: 1 }}>
                <SearchIcon sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white" }}>
                &deg;C
              </Typography>
              <Switch
                variant="outlined"
                onClick={toggleUnit}
                size="small"
                sx={{
                  color: unit === "C" ? "lightblue" : "white",
                  borderColor: "white",
                  minWidth: "30px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  marginLeft: "10px",
                  fontWeight: "bold",
                }}
              >
                {unit === "C" ? "F" : "C"}
              </Switch>
              <Typography variant="caption" sx={{ color: "white" }}>
                &deg;F
              </Typography>
            </form>
          </div>

          <div className="backdrop-blur-lg bg-white/10 rounded-2xl 
                          p-6 shadow-xl border border-white/20 
                          flex flex-col items-center text-white py-3">
            <Typography variant="overline" sx={{ color: "white" }}>
              {weatherData.location.name}, {weatherData.location.region},{" "}
              {weatherData.location.country}
            </Typography>
            <div className="flex items-center space-x-4">
              <img
                src={current.condition.icon}
                alt={current.condition.text}
                style={{ width: "60px", margin: "0 auto" }}
              />
              <Typography variant="h3" sx={{ color: "white" }}>
                {unit === "C"
                  ? current.temp_c.toFixed()
                  : current.temp_f.toFixed()}
                °{unit}
              </Typography>
            </div>
            <Typography variant="subtitle2" sx={{ color: "white" }}>
              {current.condition.text}
            </Typography>
          </div>
          <div className="flex flex-row items-center justify-center sm:justify-between py-3">
            <Typography variant="subtitle2" sx={{ color: "white" }}>
              <WbSunnyIcon className="mr-1" />
              Low: {forecast[0].day.mintemp_c}&deg;C
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "white" }}>
              <WbSunnyIcon className="mr-1" />
              High: {forecast[0].day.maxtemp_c}&deg;C
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "white" }}>
              <ThermostatIcon className="mr-1" />
              Feels like: {current.feelslike_c}&deg;C
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "white" }}>
              <OpacityIcon className="mr-1" />
              Humidity: {current.humidity}%
            </Typography>
          </div>
          <br />
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl 
                          p-6 shadow-xl border border-white/20 mt-6">
            <Forecast forecast={forecast} unit={unit} />
          </div>
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl 
                          p-6 shadow-xl border border-white/20 mt-6">
              <HourlyForecast hours={forecast[0].hour} unit={unit} />
            </div>
        </div>
        </div>
      </Fade>

  );
};

export default Weather;
