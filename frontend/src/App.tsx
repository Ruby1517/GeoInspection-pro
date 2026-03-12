import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CreateInspectionPage } from "./pages/CreateInspectionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InspectionsPage } from "./pages/InspectionsPage";
import { LoginPage } from "./pages/LoginPage";
import { NearbySearchPage } from "./pages/NearbySearchPage";
import { ServiceAreasPage } from "./pages/ServiceAreasPage";
import { InspectionDetailPage } from "./pages/InspectionDetailPage";
import { ParcelsPage } from "./pages/ParcelsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inspections"
            element={
              <ProtectedRoute>
                <InspectionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inspections/new"
            element={
              <ProtectedRoute>
                <CreateInspectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inspections/nearby"
            element={
              <ProtectedRoute>
                <NearbySearchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/service-areas"
            element={
              <ProtectedRoute>
                <ServiceAreasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inspections/:id"
            element={
              <ProtectedRoute>
                <InspectionDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parcels"
            element={
              <ProtectedRoute>
                <ParcelsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
