import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CityDetail from "./components/CityDetail";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/city/:cityName" element={<CityDetail />} />
      </Routes>
    </div>
  );
}
