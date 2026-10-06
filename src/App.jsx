import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import AddMedicine from "./pages/AddMedicine";
import SupplyChain from "./pages/SupplyChain";
import Verification from "./pages/Verification";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Medicine Management */}
        <Route
          path="/medicines"
          element={<Medicines />}
        />

        {/* Add Medicine */}
        <Route
          path="/add-medicine"
          element={<AddMedicine />}
        />

        {/* Supply Chain */}
        <Route
          path="/supply-chain"
          element={<SupplyChain />}
        />

        {/* QR / Medicine Verification */}
        <Route
          path="/verify"
          element={<Verification />}
        />

        {/* Alerts */}
        <Route
          path="/alerts"
          element={<Alerts />}
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* Unknown URL → Dashboard */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

        <Route
       path="/settings"
       element={<Settings />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;