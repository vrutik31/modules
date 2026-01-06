import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard";
import Bed from "./pages/Bed";
import Banners from "./pages/Banners";
import Councellers from "./pages/councellers";
import Testimonials from "./pages/Testimonials";
import Courses from "./pages/Courses";

export default function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bed" element={<Bed />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/councellers" element={<Councellers />} />
          <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/course" element={<Courses />} />


          {/* Redirect / to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
