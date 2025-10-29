export default function WeatherCard({ weather }) {
    return (
        <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{weather.city_name}</h2>
            <p>{weather.weather.description}</p>
            <p>🌡️ {weather.temp}°C</p>
            <p>💧 {weather.rh}% Humidity</p>
            <p>🌬️ {weather.wind_spd} m/s Wind</p>
        </div>
    );
}
