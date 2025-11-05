import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import SearchBar from "./SearchBar";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
} from "recharts";

export default function Dashboard() {
    const [weatherData, setWeatherData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCondition, setFilterCondition] = useState("All");

    const apiKey = import.meta.env.VITE_WEATHERBIT_KEY;

    useEffect(() => {
        const fetchWeatherData = async () => {
            const cities = [
                "London",
                "Paris",
                "New York",
                "Tokyo",
                "Sydney",
                "Toronto",
                "Berlin",
                "Rome",
                "Dubai",
                "Mexico City",
            ];
            try {
                const requests = cities.map((city) =>
                    axios.get(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`)
                );
                const responses = await Promise.all(requests);
                setWeatherData(responses.map((r) => r.data.data[0]));
            } catch (err) {
                console.error("Error fetching weather data:", err);
            }
        };
        fetchWeatherData();
    }, [apiKey]);

    const filteredData = weatherData
        .filter((item) =>
            item.city_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((item) =>
            filterCondition === "All"
                ? true
                : item.weather.description.includes(filterCondition)
        );

    const avgTemp =
        weatherData.length > 0
            ? (weatherData.reduce((sum, w) => sum + w.temp, 0) / weatherData.length).toFixed(1)
            : 0;
    const avgHumidity =
        weatherData.length > 0
            ? (weatherData.reduce((sum, w) => sum + w.rh, 0) / weatherData.length).toFixed(1)
            : 0;
    const hottestCity =
        weatherData.length > 0
            ? weatherData.reduce(
                (prev, curr) => (curr.temp > prev.temp ? curr : prev),
                { temp: -Infinity }
            ).city_name
            : "N/A";

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">
                🌦️ Global Weather Dashboard
            </h1>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-blue-100 p-4 rounded-lg shadow">
                    🌡️ <strong>Avg Temp:</strong> {avgTemp}°C
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow">
                    💧 <strong>Avg Humidity:</strong> {avgHumidity}%
                </div>
                <div className="bg-red-100 p-4 rounded-lg shadow">
                    🔥 <strong>Hottest City:</strong> {hottestCity}
                </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <select
                    className="border p-2 rounded mt-2"
                    value={filterCondition}
                    onChange={(e) => setFilterCondition(e.target.value)}
                >
                    <option value="All">All Conditions</option>
                    <option value="Cloud">Cloudy</option>
                    <option value="Rain">Rainy</option>
                    <option value="Clear">Clear</option>
                </select>
            </div>

            {/* Weather Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredData.map((item) => (
                    <Link key={item.city_name} to={`/city/${item.city_name}`}>
                        <WeatherCard weather={item} />
                    </Link>
                ))}
            </div>

            {/* Charts Section */}
            <div className="mt-10 grid md:grid-cols-2 gap-6">
                {/* Temperature Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-bold mb-2 text-lg">🌡️ Temperature Comparison</h2>
                    <LineChart width={400} height={250} data={weatherData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="city_name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="temp" stroke="#8884d8" />
                    </LineChart>
                </div>

                {/* Humidity Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-bold mb-2 text-lg">💧 Humidity by City</h2>
                    <BarChart width={400} height={250} data={weatherData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="city_name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rh" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}



