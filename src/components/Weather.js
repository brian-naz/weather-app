import React, { useState, useEffect } from "react";
import axios from "axios";
import Forecast from "./Forecast";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { Fade, Switch, TextField, IconButton } from "@mui/material";
import HourlyForecast from "./HourlyForecast";

const glass =
  "backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-xl";

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
            position.coords.longitude,
          );
        },
        () => {
          setLocation(savedCity);
          fetchWeatherByCity(savedCity);
        },
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
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`,
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
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`,
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

  const formatTemp = (c, f) => {
    const value = unit === "C" ? c : f;
    return Math.round(value);
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
        className={`mx-auto w-full mt-4 py-5 px-6 sm:px-8 md:px-32 bg-gradient-to-br min-h-[300px] h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
      >
        <div className="p-4 flex items-center justify-between mb-6">
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
          </form>
        </div>
      </div>
    );
  }

  const current = weatherData.current;
  const forecast = weatherData.forecast.forecastday;
  const condition = current.condition.text;
  const temp = current.temp_c;

  const actualTemp = unit === "C" ? current.temp_c : current.temp_f;
  const feelsTemp = unit === "C" ? current.feelslike_c : current.feelslike_f;

  const feelsDifference = feelsTemp - actualTemp;

  let feelsMessage = "";

  if (feelsDifference > 2) {
    feelsMessage = "It feels warmer than the actual temperature.";
  } else if (feelsDifference < -2) {
    feelsMessage = "It feels colder than the actual temperature.";
  } else {
    feelsMessage = "It feels similar to the actual temperature.";
  }

  let humidityMessage = "";

  if (current.humidity > 70) {
    humidityMessage = "The air feels humid and sticky.";
  } else if (current.humidity < 30) {
    humidityMessage = "The air feels dry.";
  } else {
    humidityMessage = "The humidity level is comfortable.";
  }

  return (
    <Fade in={handleChange}>
      <div className="relative min-h-screen">
        <div
          className={`absolute inset-0 -z-10 min-h-[100dvh] w-full py-5 px-6 sm:px-8 md:px-32 
          transition-all duration-1000 ease-in-out
          bg-gradient-to-br ${formatBackground(condition, temp)}`}
        >
          <div
            className="max-w-3xl mx-auto px-6 py-8 space-y-6"
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
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
              <p className="text-lg text-white/90 font-light">&deg;C</p>
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
              <p className="text-lg text-white/90 font-light">&deg;F</p>
            </form>
          </div>

          <div className={`flex flex-col items-center text-white p-6 mt-6`}>
            <p className="text-2xl font-light tracking-widest text-white/80">
              {weatherData.location.name}
            </p>
            <div className="flex items-center space-x-4">
              <h3 className="text-6xl font-light text-white">
                {unit === "C"
                  ? current.temp_c.toFixed()
                  : current.temp_f.toFixed()}
                °
              </h3>
            </div>
            <p className="text-lg text-white/90 font-light">
              {current.condition.text}
            </p>
            <div className="flex justify-center gap-6 mt-3 text-sm font-light opacity-80">
              <span>
                H:
                {formatTemp(
                  forecast[0].day.maxtemp_c,
                  forecast[0].day.maxtemp_f,
                )}
                °
              </span>
              <span>
                L:
                {formatTemp(
                  forecast[0].day.mintemp_c,
                  forecast[0].day.mintemp_f,
                )}
                °
              </span>
            </div>
          </div>

          <div className={`${glass} p-6 shadow-xl border border-white/20 mt-6`}>
            <HourlyForecast hours={forecast[0].hour} unit={unit} />
          </div>

          <div className={`${glass} p-6 shadow-xl border border-white/20 mt-6`}>
            <Forecast forecast={forecast} unit={unit} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className={`${glass} p-5 text-white`}>
              <p className="text-xs opacity-70 mb-2">FEELS LIKE</p>
              <p className="text-2xl font-light">
                {formatTemp(current.feelslike_c, current.feelslike_f)}°
              </p>
              <p className="text-xs opacity-80 leading-relaxed">
                {feelsMessage}
              </p>
            </div>

            <div className={`${glass} p-5 text-white`}>
              <p className="text-xs opacity-70 mb-2">HUMIDITY</p>
              <p className="text-2xl font-light">{current.humidity}%</p>
              <p className="text-xs opacity-80 leading-relaxed">
                {humidityMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Weather;
