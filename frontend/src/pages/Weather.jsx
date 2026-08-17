import React, { useState, useEffect } from 'react';
import { MARKETS, WEATHER_DATA, CROP_ADVISORIES } from '../data';

const Weather = () => {
  const [region, setRegion] = useState('auto');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLiveWeather = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      fallbackToDefault();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
          const res = await fetch(url);
          const data = await res.json();
          
          const temp = Math.round(data.current_weather.temperature);
          const wind = Math.round(data.current_weather.windspeed);
          const currentHour = new Date().getHours();
          const humidity = data.hourly.relative_humidity_2m[currentHour] || 60;
          const high = Math.round(data.daily.temperature_2m_max[0]);
          const low = Math.round(data.daily.temperature_2m_min[0]);
          const code = data.current_weather.weathercode;
          
          let icon = '☀️', condition = 'Clear';
          if (code >= 1 && code <= 3) { icon = '⛅'; condition = 'Partly Cloudy'; }
          if (code >= 45 && code <= 48) { icon = '🌫️'; condition = 'Foggy'; }
          if (code >= 51 && code <= 67) { icon = '🌧️'; condition = 'Rain'; }
          if (code >= 71 && code <= 77) { icon = '❄️'; condition = 'Snow'; }
          if (code >= 95) { icon = '⛈️'; condition = 'Thunderstorm'; }
          
          setWeather({
            icon, temp, condition, humidity, wind, high, low,
            soil_moisture: 45, rainfall: (code >= 51 && code <= 67) ? 15 : 0,
            regionId: 'delhi' // fallback for advisories
          });
          setLoading(false);
        } catch (err) {
          fallbackToDefault();
        }
      },
      (err) => {
        fallbackToDefault();
      },
      { timeout: 10000 }
    );
  };

  const fallbackToDefault = () => {
    setRegion('delhi');
    setWeather({ ...WEATHER_DATA['delhi'], regionId: 'delhi' });
    setLoading(false);
    setError('Location access denied or failed. Showing default.');
  };

  useEffect(() => {
    if (region === 'auto') {
      fetchLiveWeather();
    } else {
      setWeather({ ...WEATHER_DATA[region], regionId: region });
    }
  }, [region]);

  const icons = ['☀️', '⛅', '🌤️', '☁️', '🌧️'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const advisories = weather ? (CROP_ADVISORIES[weather.regionId] || CROP_ADVISORIES.delhi) : [];

  return (
    <section className="section active" id="weather">
      <div className="section-banner banner-weather">
        <div className="section-banner-content">
          <h2 className="section-banner-title">Weather & Crop Advisory</h2>
          <p className="section-banner-desc">Weather-based recommendations for your region</p>
        </div>
        <div className="section-banner-icon">🌤️</div>
      </div>
      
      <div className="weather-controls">
        <select className="select-input" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="auto">📍 Auto (My Location)</option>
          {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      
      {error && <div style={{ color: 'var(--red)', margin: '0 0 16px' }}>{error}</div>}

      <div className="weather-grid">
        <div className="card glass weather-current">
          {loading || !weather ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>Locating & Fetching Live Weather...</p>
            </div>
          ) : (
            <>
              <div className="weather-icon-large">{weather.icon}</div>
              <div className="weather-temp">{weather.temp}°C</div>
              <div className="weather-desc">{weather.condition}</div>
              <div className="weather-details">
                <span>💧 Humidity: {weather.humidity}%</span>
                <span>💨 Wind: {weather.wind} km/h</span>
                <span>🌡️ H:{weather.high}° L:{weather.low}°</span>
              </div>
            </>
          )}
        </div>
        
        <div className="card glass forecast-row">
          {weather && dayNames.map((d, i) => (
            <div className="forecast-day" key={d}>
              <div className="forecast-day-name">{d}</div>
              <div className="forecast-icon">{icons[i % 5]}</div>
              <div className="forecast-temp">
                {weather.temp + Math.round(Math.random() * 4 - 2)}°/{weather.low + Math.round(Math.random() * 3)}°
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-advisories">
        <div className="card glass">
          <h3>Crop Advisory</h3>
          <div className="advisory-list">
            {advisories.map((a, i) => (
              <div className="advisory-item" key={i}>
                <span className="advisory-icon">{a.icon}</span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card glass">
          <h3>Soil & Moisture</h3>
          {weather && (
            <>
              <div className="indicator-bar">
                <div className="indicator-label">
                  <span>Soil Moisture</span>
                  <span>{weather.soil_moisture}%</span>
                </div>
                <div className="indicator-track">
                  <div className="indicator-fill" style={{ width: `${weather.soil_moisture}%`, background: 'linear-gradient(90deg,#e74c3c,#f39c12,#2ecc71)' }}></div>
                </div>
              </div>
              <div className="indicator-bar" style={{ marginTop: '16px' }}>
                <div className="indicator-label">
                  <span>Rainfall Level</span>
                  <span>{weather.rainfall}mm</span>
                </div>
                <div className="indicator-track">
                  <div className="indicator-fill" style={{ width: `${Math.min(weather.rainfall, 100)}%`, background: 'linear-gradient(90deg,#3498db,#2980b9)' }}></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Weather;
