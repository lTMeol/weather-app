import React, { useEffect, useState } from "react";
import { fetchForecastByCoords } from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "../css/Detail.css";

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const city = location.state?.city || "Hanoi";
  const coords = location.state?.coords;
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (coords) {
      const getForecast = async () => {
        try {
          const data = await fetchForecastByCoords(coords.lat, coords.lon);

          if (!data.daily || !Array.isArray(data.daily)) {
            console.error(" Dữ liệu forecast không hợp lệ:", data);
            return;
          }

          setForecast(data.daily);
        } catch (error) {
          console.error(" Lỗi khi lấy dự báo:", error);
        }
      };
      getForecast();
    }
  }, [coords]);

  return (
    <div className="detail-container">
      <nav className="detail-nav">
        <h1>Weather Forecast</h1>
        <ul>
          <li onClick={() => navigate("/")}>Home</li>
          <li className="active">Detail</li>
          <li onClick={() => navigate("/history")}>History</li>
        </ul>
      </nav>

      <div className="detail-content">
        <div className="detail-header">
          <h2>{city}</h2>
          <button onClick={() => navigate(-1)}>← Back</button>
        </div>

        {forecast.map((entry, index) => (
          <div key={index} className="detail-card">
            <div className="detail-info">
              <h3>{moment.unix(entry.dt).format("dddd")}</h3>
              <p>{entry.weather[0].description}</p>
              <p>🌡 Temp: {Math.round(entry.temp.day)}°C</p>
              <p>💧 Humidity: {entry.humidity}%</p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
              alt="icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
