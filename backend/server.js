const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const { getWeatherForCities, saveDailySummary } = require('./controllers/weatherController');
const weatherRoutes = require('./routes/weatherRoutes');
const DailySummary = require('./models/DailySummary'); // Adjust path as needed
dotenv.config();  // Load environment variables from .env

const app = express();

// Middleware
app.use(cors({
  origin: ["https://weather-monitoring-31gr.onrender.com/", "https://personal-weather-monitor.netlify.app","http://localhost:3001"],
  credentials: true  // Allow cookies/auth headers if needed
}));
app.use(express.json());
app.use('/api/weather', weatherRoutes);  // Ensure this is correctly set up

// Connect to MongoDB DataBase
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schedule a job to run every 5 minutes to fetch and store weather data
cron.schedule('* * * * *', () => {
  console.log('Fetching weather data for cities every 5 minutes...');
  getWeatherForCities();  // Call the function from the controller to fetch data
});


// Schedule a job to run at midnight to calculate and store daily summaries
cron.schedule('* * * * *', async () => { 
  console.log('Calculating and saving daily weather summaries...');
  
  try {
    // Clear previous daily summaries
    await DailySummary.deleteMany({});
    console.log('Previous daily summaries cleared.');

    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bengaluru', 'Kolkata', 'Hyderabad'];

    // Use async/await to ensure saveDailySummary completes for each city
    for (const city of cities) {
      try {
        await saveDailySummary(city);
        console.log(`Daily summary saved for ${city}`);
      } catch (error) {
        console.error(`Error saving daily summary for ${city}:`, error);
      }
    }
  } catch (error) {
    console.error('Error clearing previous daily summaries:', error);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
