const API_KEY = 'c62aa60edcc72f6106d13f8728c235f6';

export const fetchWeatherByCity = async (city) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Không tìm thấy thành phố.");
  return res.json();
};

export const fetchHourlyForecast = async (lat, lon) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu dự báo.");
  return res.json();
};

export const fetchForecastByCoords = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) throw new Error("Forecast API failed");

  const data = await response.json();
  const dailyMap = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; 
    if (!dailyMap[date]) {
      dailyMap[date] = [];
    }
    dailyMap[date].push(item);
  });

  const dailyArray = Object.keys(dailyMap).slice(0, 7).map((date) => {
    const items = dailyMap[date];

    const temps = items.map(i => i.main.temp);
    const humidities = items.map(i => i.main.humidity);
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      dt: new Date(date).getTime() / 1000,
      temp: {
        day: avg(temps),
        night: avg(temps.slice(0, 2)), 
      },
      humidity: Math.round(avg(humidities)),
      weather: [items[0].weather[0]], 
    };
  });

  return { daily: dailyArray };
};
