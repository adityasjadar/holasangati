import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import RequireRole from './auth/RequireRole';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import WorkerSearchPage from './pages/WorkerSearchPage';
import MachinerySearchPage from './pages/MachinerySearchPage';
import MachineDetailsPage from './pages/MachineDetailsPage';
import NearbyPage from './pages/NearbyPage';
import PostRequirementPage from './pages/PostRequirementPage';
import MyRequirementsPage from './pages/MyRequirementsPage';
import MyMachineryPage from './pages/MyMachineryPage';
import MyWorkerProfilePage from './pages/MyWorkerProfilePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './auth/AuthContext';

function Home() {
  const { user } = useAuth();
  return user ? <FarmerDashboard /> : <LandingPage />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/workers" element={<WorkerSearchPage />} />
              <Route path="/machinery" element={<MachinerySearchPage />} />
              <Route path="/machinery/:id" element={<MachineDetailsPage />} />
              <Route path="/nearby" element={<NearbyPage />} />
              <Route path="/post-requirement" element={<RequireAuth><PostRequirementPage /></RequireAuth>} />
              <Route path="/my-requirements" element={<RequireAuth><MyRequirementsPage /></RequireAuth>} />
              <Route path="/my-machinery" element={<RequireAuth><RequireRole roles={['owner']}><MyMachineryPage /></RequireRole></RequireAuth>} />
              <Route path="/my-work-profile" element={<RequireAuth><RequireRole roles={['worker']}><MyWorkerProfilePage /></RequireRole></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/admin" element={<RequireAuth><RequireRole roles={['admin']}><AdminDashboard /></RequireRole></RequireAuth>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
