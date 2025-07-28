import React, { useState } from "react";
import { fetchWeatherByCity, fetchHourlyForecast } from "../utils/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../css/Home.css";
import { Link, useNavigate } from "react-router-dom"; 


const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate(); 

  const handleSearch = async () => {
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);

      const { lat, lon } = data.coord;
      const forecast = await fetchHourlyForecast(lat, lon);

      const hourlyData = forecast.list.slice(0, 7).map((entry) => {
        const date = new Date(entry.dt * 1000);
        const hours = date.getHours();
        return {
          time: `${hours}h`,
          temp: Math.round(entry.main.temp),
        };
      });
      setChartData(hourlyData);

      const today = new Date().toISOString().split("T")[0];
      const newEntry = {
        name: data.name,
        temp: Math.round(data.main.temp),
        icon: data.weather[0].icon,
        lastViewed: today,
        coords: { lat, lon },
      };

      let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      history = history.filter((item) => item.name !== newEntry.name);
      history.unshift(newEntry);
      history = history.slice(0, 6);
      localStorage.setItem("searchHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  return (
    <div className="home-container">
      {/* Nav */}
      <nav className="nav-bar">
        <h1>Weather Forecast</h1>
        <ul>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/history")}>History</li>
        </ul>
      </nav>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>

      {/* Weather card */}
      {weather && (
        <div className="weather-card">
          <div>
            <h2>{weather.name}</h2>
            <p className="description">{weather.weather[0].description}</p>
            <div className="temp">{Math.round(weather.main.temp)}°C</div>
            <p className="extra">Feels like: {Math.round(weather.main.feels_like)}°C</p>
            <div className="extra">
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>💨 Wind: {weather.wind.speed} m/s</p>
            </div>

            {/*  Nút chuyển sang Detail */}
            <button
              className="detail-button"
              onClick={() => navigate("/detail", {
                state: {
                  city: weather.name,
                  coords: weather.coord,
                }
              })}
            >
              Xem dự báo 7 ngày
            </button>
          </div>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="icon"
            className="weather-icon"
          />
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="chart-card">
          <h3>Temperature Forecast</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#fff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Home;
