# Real-Time Weather Monitoring System with Rollups and Alerts

## Overview
The **Weather Monitoring System** is a real-time application that retrieves weather data from the OpenWeatherMap API, processes and stores the data, and provides summarized insights using rollups and aggregates. The system supports configurable alert thresholds, daily summaries, and visualization of weather trends for major Indian cities.

## Features
- **Real-Time Weather Data Retrieval**: Fetches weather data for Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad at a configurable interval.
- **Daily Summaries**: Aggregates daily data with insights including average, maximum, and minimum temperatures, and the dominant weather condition.
- **User-Configurable Alerts**: Triggers alerts when specific conditions are breached (e.g., temperature exceeding a threshold for consecutive updates).
- **Visualization**: Displays historical temperature trends, daily summaries, and triggered alerts.

---

## Project Structure
- **Frontend**: React-based UI to display weather summaries, alerts, and temperature trends.
- **Backend**: Node.js and Express.js API for data processing, retrieval, and storage.
- **Data Storage**: MongoDB to store weather data, daily summaries, and alerts.

---

## Installation and Setup

### Prerequisites
1. **Node.js** (>= v14.0) and **npm**: Install from [Node.js Official Website](https://nodejs.org/).
2. **MongoDB**: Ensure a running MongoDB instance. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB server.
3. **Environment Variables**:
   - Create a `.env` file in the backend folder.
   - Define `MONGO_URI` with your MongoDB connection string.
   - Define `OPENWEATHERMAP_API_KEY` with your OpenWeatherMap API key.

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ChefnCoder/weather-monitoring-system.git
   cd weather-monitoring-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB** (Skip if using MongoDB Atlas)

5. **Run the Backend Server**
   - Navigate to the backend folder and start the server:
     ```bash
     cd ../backend
     npm start
     ```
   - Backend will run on `http://localhost:5000`.

6. **Run the Frontend Server**
   - Navigate to the frontend folder and start the frontend server:
     ```bash
     cd ../frontend
     npm start
     ```
   - Frontend will run on `http://localhost:3000`.

---

## API Endpoints

### 1. Get Daily Summaries
   - **Endpoint**: `GET /api/weather/summaries`
   - **Response**: Returns daily summaries including temperature averages, extremes, and dominant weather conditions.

### 2. Get Alerts
   - **Endpoint**: `GET /api/weather/alerts`
   - **Response**: Returns a list of recent alerts based on user-defined thresholds.

### 3. Fetch Weather Data (Cron)
   - Fetches real-time weather data for Indian cities every 5 minutes and stores it in MongoDB.

### 4. Calculate Daily Summaries (Cron)
   - Aggregates data at midnight to create daily summaries and stores them in MongoDB.

---

## Design Choices

### 1. **Data Processing**
   - The application fetches real-time weather data at configurable intervals, converting temperatures from Kelvin to Celsius for consistency.
   - A cron job calculates daily weather summaries to optimize for data retrieval and reduce repetitive computations.

### 2. **Alerts and Thresholds**
   - Alerts are generated when specific weather thresholds are breached in consecutive updates, making them sensitive to sudden temperature changes.
   - Alerts are stored in MongoDB for historical access and monitoring.

### 3. **React and Visualization**
   - Components dynamically display summaries, alerts, and trends, with customizable dark/light themes.
   - Temperature trends are visualized with Recharts for interactive analysis of historical weather data.

---

## Dependencies

### Backend
- `express`: Web server framework for Node.js.
- `mongoose`: MongoDB object modeling for schema definition and interaction.
- `axios`: HTTP client to call OpenWeatherMap API.
- `dotenv`: Loads environment variables from `.env`.
- `node-cron`: Schedules data retrieval and summary calculation.

### Frontend
- `react`: JavaScript library for building the UI.
- `axios`: HTTP client for making API requests.
- `recharts`: Chart library for visualizing temperature trends.

---

## Usage and Testing

1. **Weather Data Retrieval**: Cron job fetches weather data every 5 minutes, automatically storing data and checking for alerts.
2. **Daily Summaries**: Cron job aggregates daily summaries at midnight and saves them in MongoDB for historical analysis.
3. **Alert Notifications**: New alerts are displayed as pop-ups and stored for review.
4. **Visualization**: Real-time trends and summaries can be viewed in the frontend application.
