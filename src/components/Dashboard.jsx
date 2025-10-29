import { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import SearchBar from "./SearchBar";

export default function Dashboard() {
    const [weatherData, setWeatherData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCondition, setFilterCondition] = useState("All");

    const apiKey = import.meta.env.VITE_WEATHERBIT_KEY;

    useEffect(() => {
        const fetchWeatherData = async () => {
            const cities = ["London", "Paris", "New York", "Tokyo", "Sydney", "Toronto", "Berlin", "Rome", "Dubai", "Mexico City"];
            const requests = cities.map(city =>
                axios.get(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`)
            );
            const responses = await Promise.all(requests);
            setWeatherData(responses.map(r => r.data.data[0]));
        };
        fetchWeatherData();
    }, [apiKey]);


    const filteredData = weatherData
        .filter(item => item.city_name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(item => (filterCondition === "All" ? true : item.weather.description.includes(filterCondition)));


    const avgTemp = (weatherData.reduce((sum, w) => sum + w.temp, 0) / weatherData.length).toFixed(1);
    const avgHumidity = (weatherData.reduce((sum, w) => sum + w.rh, 0) / weatherData.length).toFixed(1);
    const hottestCity = weatherData.reduce((prev, curr) => (curr.temp > prev.temp ? curr : prev), { temp: -Infinity }).city_name;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">🌦️ Global Weather Dashboard</h1>


            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-blue-100 p-4 rounded-lg shadow">🌡️ Avg Temp: {avgTemp}°C</div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow">💧 Avg Humidity: {avgHumidity}%</div>
                <div className="bg-red-100 p-4 rounded-lg shadow">🔥 Hottest City: {hottestCity}</div>
            </div>


            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <select
                className="border p-2 rounded mt-2 mb-4"
                value={filterCondition}
                onChange={e => setFilterCondition(e.target.value)}
            >
                <option value="All">All Conditions</option>
                <option value="Cloud">Cloudy</option>
                <option value="Rain">Rainy</option>
                <option value="Clear">Clear</option>
            </select>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredData.map(item => (
                    <WeatherCard key={item.city_name} weather={item} />
                ))}
            </div>
        </div>
    );
}
