import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/History.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setHistory([]);
  };

  const handleViewForecast = (entry) => {
    navigate("/detail", {
      state: { city: entry.name, coords: entry.coords },
    });
  };

  return (
   <div className="history-container">
  {/* Nav */}
  <nav className="history-nav">
    <h1>🌤️ Weather Forecast</h1>
    <ul>
      <li onClick={() => navigate("/")}>Home</li>
      <li className="underline">History</li>
    </ul>
  </nav>

  <div className="history-header">
    <h2>Search History</h2>
    <button onClick={clearHistory} className="clear-btn">
      🗑 Clear All History
    </button>
  </div>

  {/* Cards */}
  <div className="history-grid">
    {history.map((item, idx) => (
      <div key={idx} className="history-card">
        <div className="top">
          <h3>{item.name}</h3>
          <div className="temp-icon">
            <p>{item.temp}°</p>
            <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt="icon" />
          </div>
        </div>
        <p className="date">Last viewed: {item.lastViewed}</p>
        <button onClick={() => handleViewForecast(item)} className="view-btn">
          View Forecast →
        </button>
      </div>
    ))}
  </div>
</div>

  );
};

export default History;
