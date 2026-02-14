import React from "react";
import { useState } from "react";

const CityCard = ({ city, unit, onSelect, onDelete }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 60;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      onDelete(city.name);
    }
  };

  const formatTemp = (c, f) => {
    const value = unit === "C" ? c : f;
    return Math.round(value);
  };

  const getBackground = () => {
    const c = city.condition.toLowerCase();
    if (c.includes("rain")) return "from-gray-700 to-blue-900";
    if (c.includes("cloud")) return "from-gray-400 to-gray-700";
    if (c.includes("snow")) return "from-blue-200 to-blue-400";
    return "from-sky-500 via-blue-500 to-blue-700";
  };

  return (
    <div
      onClick={() => onSelect(city)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`cursor-pointer relative
    transition-all duration-500 ease-in-out
    `}
    >
      <div
        className={`bg-gradient-to-br ${getBackground()} 
      rounded-3xl p-4 mb-4 text-white shadow-lg 
      transition-all duration-500 ease-in-out`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-light text-lg">{city.name}</p>
            <p className="text-sm opacity-80">{city.condition}</p>
          </div>

          <p className="text-2xl font-light">
            {formatTemp(city.temp_c, city.temp_f)}°
          </p>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
