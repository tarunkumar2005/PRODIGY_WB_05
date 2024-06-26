import React, { useState } from 'react';
import axios from 'axios';
import { openweathermapapi, opencagedataapi } from '../../Api_Keys';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            appid: openweathermapapi,
            units: 'metric',
          },
        }
      );
      setWeatherData(response.data);
    } catch (error) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (location) {
      try {
        // Use OpenCage Geocoding API to fetch coordinates
        const geocodeResponse = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              q: location,
              key: opencagedataapi,
            },
          }
        );

        // Extract latitude and longitude from geocoding response
        const { lat, lng } = geocodeResponse.data.results[0].geometry;

        // Fetch weather using obtained latitude and longitude
        fetchWeather(lat, lng);
      } catch (error) {
        console.error('Error fetching geolocation:', error);
        setError('Failed to retrieve location. Please enter a valid location.');
      }
    } else {
      setError('Please enter a location.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-4">Weather App</h1>
      <form onSubmit={handleLocationSubmit} className="mb-4 max-w-md w-full">
        <div className="flex">
          <input
            type="text"
            className="p-2 rounded-l-md text-black w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter location (e.g., city name, zip code)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-md ml-2 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Weather
          </button>
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {weatherData && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">{weatherData.name}</h2>
          <p className="text-lg">{weatherData.weather[0].description}</p>
          <p className="text-3xl">{weatherData.main.temp}°C</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-400">Humidity</p>
              <p>{weatherData.main.humidity}%</p>
            </div>
            <div>
              <p className="text-gray-400">Wind Speed</p>
              <p>{weatherData.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;