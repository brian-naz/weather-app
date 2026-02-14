import React, { useState, useEffect } from "react";
import axios from "axios";
import Forecast from "./Forecast";
import HourlyForecast from "./HourlyForecast";
import CityCard from "./CityCard";

const glass =
  "backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem("tempUnit") || "C";
  });
  const API_KEY = "26dc33589eb94455928200533252903";

  const formatBackground = (condition, temp) => {
    if (!condition) return "from-cyan-700 to-blue-700";

    const c = condition.toLowerCase();

    if (c.includes("rain") || c.includes("drizzle")) {
      return "from-gray-800 via-blue-900 to-black animate-rain";
    }

    if (c.includes("cloud") || c.includes("overcast")) {
      return "from-gray-400 via-gray-600 to-gray-800 animate-cloud";
    }

    if (c.includes("snow")) {
      return "from-blue-200 via-white to-blue-400 animate-snow";
    }

    if (c.includes("clear") || c.includes("sunny")) {
      return "from-sky-500 via-blue-500 to-blue-700 animate-sky";
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
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`,
      );
      setWeatherData(response.data);

      setError("");
      localStorage.setItem("lastCity", city);

      setSearchHistory((prev) => {
        const updated = [
          {
            name: response.data.location.name,
            temp_c: response.data.current.temp_c,
            temp_f: response.data.current.temp_f,
            condition: response.data.current.condition.text,
          },
          ...prev.filter((item) => item.name !== response.data.location.name),
        ].slice(0, 8); // keep last 8 cities

        localStorage.setItem("weatherHistory", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      setError("Unable to fetch weather for the city.");
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`,
      );
      setWeatherData(response.data);
      setLocation(response.data.location.name);

      setError("");
      localStorage.setItem("lastCity", response.data.location.name);
    } catch (error) {
      setError("Unable to fetch weather by location.");
    }
  };

  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("weatherHistory");
    return saved ? JSON.parse(saved) : [];
  });

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

  if (error) {
    return <div className="flex items-center justify-around my-6">{error}</div>;
  }

  if (!weatherData) {
    return (
      <div className="relative min-h-screen">
        <div
          className={`absolute inset-0 -z-10 min-h-[100dvh] w-full py-5 px-6 sm:px-8 md:px-32 
          transition-all duration-1000 ease-in-out
          bg-gradient-to-br ${formatBackground()}`}
        >
          <div
            className="max-w-3xl mx-auto px-6 py-8 space-y-6"
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div
                className="flex items-center flex-1 backdrop-blur-2xl 
                  bg-white/5 border border-white/10 
                  rounded-full px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
              >
                <svg
                  className="w-5 h-5 text-white/70 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                <input
                  type="text"
                  placeholder="Search"
                  value={location}
                  onChange={handleChange}
                  className="bg-transparent outline-none text-white 
                 placeholder-white/50 w-full font-light"
                />
              </div>
              <p className="text-white/70 text-sm">°C</p>
              <button
                type="button"
                onClick={toggleUnit}
                className={`relative w-12 h-7 rounded-full transition-all duration-300
    ${unit === "F" ? "bg-blue-500" : "bg-white/20"}`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full
      transition-all duration-300 shadow-md
      ${unit === "F" ? "translate-x-5" : ""}`}
                />
              </button>

              <p className="text-white/70 text-sm">°F</p>
            </form>
          </div>
          <div className={`flex flex-col items-center text-white/90 p-4 mt-4`}>
            <p className="text-2xl font-light tracking-widest text-white/80">
              No Location Found
            </p>
            <div className="flex items-center space-x-4">
              <h3 className="text-6xl font-light text-white/90">--</h3>
            </div>
            <p className="text-lg text-white/90 font-light">--</p>
            <div className="flex justify-center gap-4 text-sm font-light opacity-80">
              <span>H:</span>
              <span>L:</span>
            </div>
          </div>
          <div
            className={`${glass} p-4 shadow-xl border border-white/20 mt-4 mx-2`}
          ></div>
          <div
            className={`${glass} p-4 shadow-xl border border-white/20 mt-4 mx-2`}
          >
            <p className="text-white text-xs tracking-widest opacity-70 mb-4">
              3-DAY FORECAST
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 mx-2">
            <div className={`${glass} p-5 text-white/90`}>
              <p className="text-xs opacity-70 mb-2">FEELS LIKE</p>
              <p className="text-2xl font-light">--</p>
              <p className="text-xs opacity-80 leading-relaxed"></p>
            </div>

            <div className={`${glass} p-5 text-white/90 mx-2`}>
              <p className="text-xs opacity-70 mb-2">HUMIDITY</p>
              <p className="text-2xl font-light">--</p>
              <p className="text-xs opacity-80 leading-relaxed"></p>
            </div>
          </div>
          <button
            onClick={() => setShowDrawer(true)}
            className="fixed bottom-6 right-6 z-50
           h-14 w-14 flex items-center justify-center
           backdrop-blur-2xl bg-white/10
           border border-white/10
           rounded-full
           shadow-[0_8px_30px_rgba(0,0,0,0.25)]
           text-white/90 text-xl"
          >
            <div className="flex flex-col gap-[3px]">
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
            </div>
          </button>
          <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 ${
              showDrawer
                ? "opacity-100 bg-black/40"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setShowDrawer(false)}
          />
          <div
            className={`fixed inset-0 z-50 
    bg-white/5 backdrop-blur-3xl border-l border-white/10
    transform transition-transform duration-300 ease-out
    ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="h-full w-full p-4 overflow-y-auto">
              <div className="p-4 overflow-y-auto h-full">
                <p className="text-5xl font-light text-white/90 mb-6">
                  Weather
                </p>

                {searchHistory.map((city, index) => (
                  <CityCard
                    key={index}
                    city={city}
                    unit={unit}
                    onSelect={(city) => {
                      fetchWeatherByCity(city.name);
                      setShowDrawer(false);
                    }}
                    onDelete={(name) => {
                      if (name === weatherData.location.name) {
                        return;
                      }
                      const updated = searchHistory.filter(
                        (c) => c.name !== name,
                      );
                      setSearchHistory(updated);
                      localStorage.setItem(
                        "weatherHistory",
                        JSON.stringify(updated),
                      );
                    }}
                  />
                ))}
                {searchHistory.length === 0 && (
                  <div
                    onClick={() => setShowDrawer(false)}
                    className="flex items-center justify-center h-full text-white/70 text-sm"
                  >
                    No saved locations
                    <br />
                  </div>
                )}
              </div>
            </div>
          </div>
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
    <div className="relative min-h-screen">
      <div
        className={`absolute inset-0 -z-10 min-h-[100dvh] w-full py-5 px-6 sm:px-8 md:px-32 
          transition-all duration-1000 ease-in-out
          bg-gradient-to-br ${formatBackground(condition, temp)}`}
      ></div>
      <div
        className="max-w-3xl mx-auto px-6 py-8 space-y-6"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div
            className="flex items-center flex-1 backdrop-blur-2xl 
                  bg-white/5 border border-white/10 
                  rounded-full px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          >
            <svg
              className="w-5 h-5 text-white/70 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Search"
              value={location}
              onChange={handleChange}
              className="bg-transparent outline-none text-white 
                 placeholder-white/50 w-full font-light"
            />
          </div>
          <p className="text-white/70 text-sm">°C</p>
          <button
            type="button"
            onClick={toggleUnit}
            className={`relative w-12 h-7 rounded-full transition-all duration-300
    ${unit === "F" ? "bg-blue-500" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full
      transition-all duration-300 shadow-md
      ${unit === "F" ? "translate-x-5" : ""}`}
            />
          </button>

          <p className="text-white/70 text-sm">°F</p>
        </form>
      </div>
      <div className={`flex flex-col items-center text-white/90 p-4 mt-4`}>
        <p className="text-2xl font-light tracking-widest text-white/80">
          {weatherData.location.name}
        </p>
        <div className="flex items-center space-x-4">
          <h3 className="text-6xl font-light text-white/90">
            {unit === "C" ? current.temp_c.toFixed() : current.temp_f.toFixed()}
            °
          </h3>
        </div>
        <p className="text-lg text-white/90 font-light">
          {current.condition.text}
        </p>
        <div className="flex justify-center gap-4 text-sm font-light opacity-80">
          <span>
            H:
            {formatTemp(forecast[0].day.maxtemp_c, forecast[0].day.maxtemp_f)}°
          </span>
          <span>
            L:
            {formatTemp(forecast[0].day.mintemp_c, forecast[0].day.mintemp_f)}°
          </span>
        </div>
      </div>
      <div
        className={`${glass} p-4 shadow-xl border border-white/20 mt-4 mx-2`}
      >
        <HourlyForecast hours={forecast[0].hour} unit={unit} />
      </div>
      <div
        className={`${glass} p-4 shadow-xl border border-white/20 mt-4 mx-2`}
      >
        <Forecast forecast={forecast} unit={unit} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 mx-2">
        <div className={`${glass} p-5 text-white/90`}>
          <p className="text-xs opacity-70 mb-2">FEELS LIKE</p>
          <p className="text-2xl font-light">
            {formatTemp(current.feelslike_c, current.feelslike_f)}°
          </p>
          <p className="text-xs opacity-80 leading-relaxed">{feelsMessage}</p>
        </div>

        <div className={`${glass} p-5 text-white/90 mx-2`}>
          <p className="text-xs opacity-70 mb-2">HUMIDITY</p>
          <p className="text-2xl font-light">{current.humidity}%</p>
          <p className="text-xs opacity-80 leading-relaxed">
            {humidityMessage}
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowDrawer(true)}
        className="fixed bottom-6 right-6 z-50
           h-14 w-14 flex items-center justify-center
           backdrop-blur-2xl bg-white/10
           border border-white/10
           rounded-full
           shadow-[0_8px_30px_rgba(0,0,0,0.25)]
           text-white/90 text-xl"
      >
        <div className="flex flex-col gap-[3px]">
          <div className="w-5 h-[2px] bg-white rounded-full"></div>
          <div className="w-5 h-[2px] bg-white rounded-full"></div>
          <div className="w-5 h-[2px] bg-white rounded-full"></div>
        </div>
      </button>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          showDrawer
            ? "opacity-100 bg-black/40"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowDrawer(false)}
      />
      <div
        className={`fixed inset-0 z-50 
    bg-white/5 backdrop-blur-3xl border-l border-white/10
    transform transition-transform duration-300 ease-out
    ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full w-full p-4 overflow-y-auto">
          <div className="p-4 overflow-y-auto h-full">
            <p className="text-5xl font-light text-white/90 mb-6">Weather</p>

            {searchHistory.map((city, index) => (
              <CityCard
                key={index}
                city={city}
                unit={unit}
                onSelect={(city) => {
                  fetchWeatherByCity(city.name);
                  setShowDrawer(false);
                }}
                onDelete={(name) => {
                  if (name === weatherData.location.name) {
                    return;
                  }
                  const updated = searchHistory.filter((c) => c.name !== name);
                  setSearchHistory(updated);
                  localStorage.setItem(
                    "weatherHistory",
                    JSON.stringify(updated),
                  );
                }}
              />
            ))}
            {searchHistory.length === 0 && (
              <div
                onClick={() => setShowDrawer(false)}
                className="flex items-center justify-center h-full text-white/70 text-sm"
              >
                No saved locations
                <br />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
