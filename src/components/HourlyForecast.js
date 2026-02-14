import React, { useRef, useState, useEffect } from "react";

const HourlyForecast = ({ hours, unit }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
    );
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                     backdrop-blur-xl bg-white/5 border border-white/5
                     rounded-full w-7 h-7 flex items-center justify-center
                     text-white shadow-md"
        >
          ‹
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="overflow-x-scroll scrollbar-hide whitespace-nowrap py-4 px-8"
      >
        <div className="flex gap-4 text-white">
          {hours.map((hour, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[60px]">
              <p className="text-sm opacity-80">
                {new Date(hour.time).getHours()}:00
              </p>
              <img
                src={`https:${hour.condition.icon}`}
                alt=""
                className="w-10 my-1"
              />
              <p className="text-sm font-light">
                {unit === "C" ? hour.temp_c : hour.temp_f}°
              </p>
            </div>
          ))}
        </div>
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                     backdrop-blur-xl bg-white/5 border border-white/5
                     rounded-full w-7 h-7 flex items-center justify-center
                     text-white shadow-md"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default HourlyForecast;
