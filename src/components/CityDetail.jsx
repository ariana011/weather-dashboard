import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CityDetail() {
    const { cityName } = useParams();
    const [cityData, setCityData] = useState(null);
    const apiKey = import.meta.env.VITE_WEATHERBIT_KEY;

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `https://api.weatherbit.io/v2.0/current?city=${cityName}&key=${apiKey}`
            );
            setCityData(response.data.data[0]);
        };
        fetchData();
    }, [cityName, apiKey]);

    if (!cityData) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">{cityData.city_name} 🌤️</h1>
            <p>Temperature: {cityData.temp}°C</p>
            <p>Humidity: {cityData.rh}%</p>
            <p>Weather: {cityData.weather.description}</p>
            <p>Wind Speed: {cityData.wind_spd} m/s</p>
            <p>Pressure: {cityData.pres} mb</p>
            <Link to="/" className="text-blue-500 underline mt-4 inline-block">
                ← Back to Dashboard
            </Link>
        </div>
    );
}
