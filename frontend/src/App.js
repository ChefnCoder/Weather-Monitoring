import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const App = () => {
  const [weatherSummaries, setWeatherSummaries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newAlert, setNewAlert] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  //const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherSummaries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/weather/summaries');
        setWeatherSummaries(response.data);
      } catch (error) {
        console.log('Failed to fetch weather summaries');
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherSummaries();
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/weather/alerts');
        const latestAlert = response.data[0];
        if (latestAlert && (!alerts.length || latestAlert._id !== alerts[0]._id)) {
          setNewAlert(latestAlert);
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 5000);
        }
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, [alerts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="flex justify-between items-center p-5 shadow-md">
        <h1 className="text-3xl font-bold">Weather Monitoring System</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-800 text-white px-3 py-1 rounded-full"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      {/* Popup Notification for New Alerts */}
      {showPopup && newAlert && (
        <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out animate-fadeIn">
          <p className="font-bold">New Alert!</p>
          <p>{newAlert.message}</p>
          <p className="text-sm">{new Date(newAlert.timestamp).toLocaleString()}</p>
        </div>
      )}

      {/* Weather Summaries Section */}
      <section className="container mx-auto my-8 p-4">
        <h2 className="text-3xl font-semibold text-center mb-5">Daily Weather Summaries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {weatherSummaries.map((summary, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl border-t-4 ${summary.avg_temp < 28.5 ? 'bg-blue-100 border-blue-500' : 'bg-red-100 border-red-500'}`}
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, ${summary.avg_temp < 28.5 ? 'rgba(173, 216, 230, 0.8)' : 'rgba(255, 182, 193, 0.8)'} 100%)`,
              }}
            >
              <div className="flex items-center mb-3">
                <h3 className="text-3xl font-bold text-gray-900">{summary.city}</h3>
                {summary.icon && (
                  <img
                  src={`http://openweathermap.org/img/wn/${summary.icon}@2x.png`}
                  alt={summary.dominant_condition}
                  className="w-10 h-10 ml-3"
                />
                )}
              </div>
              <p className="text-xl text-gray-700 mb-1 font-semibold">Avg Temp: {summary.avg_temp.toFixed(2)}°C</p>
              <p className="text-lg text-gray-700 mb-1">Max Temp: {summary.max_temp.toFixed(2)}°C</p>
              <p className="text-lg text-gray-700 mb-1">Min Temp: {summary.min_temp.toFixed(2)}°C</p>
              <p className="text-lg text-gray-700 flex items-center">
                Dominant Condition: <span className="ml-2 font-medium text-gray-600">{summary.dominant_condition}</span>
              </p>
              <p className="text-gray-500 text-sm mt-3">{new Date(summary.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>





      {/* Temperature Trends Section */}
      <section className="container mx-auto mb-8 p-4">
        <h2 className="text-2xl font-semibold text-center mb-5">Historical Temperature Trends</h2>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weatherSummaries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7300" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ff7300" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", borderRadius: '5px', color: '#fff' }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `${value.toFixed(2)}°C`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avg_temp"
                stroke="url(#colorAvg)"
                strokeWidth={3}
                dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8 }}
                name="Average Temp"
              />
              <Line
                type="monotone"
                dataKey="max_temp"
                stroke="url(#colorMax)"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: "#82ca9d", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8 }}
                name="Max Temp"
              />
              <Line
                type="monotone"
                dataKey="min_temp"
                stroke="url(#colorMin)"
                strokeWidth={3}
                strokeDasharray="3 4 5 2"
                dot={{ fill: "#ff7300", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8 }}
                name="Min Temp"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Triggered Alerts Section */}
      <section className="container mx-auto mb-8 p-4">
        <h2 className="text-2xl font-semibold text-center mb-5">Triggered Alerts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Alert Message</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {alerts.map((alert, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="border px-4 py-2">{alert.city}</td>
                  <td className="border px-4 py-2">{alert.message}</td>
                  <td className="border px-4 py-2">{new Date(alert.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Weather Monitoring System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
