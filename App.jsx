import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider, useAuth } from './AuthContext';
import RequireAuth from './RequireAuth';
import RequireRole from './RequireRole';
import Header from './Header';
import Footer from './Footer';

import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import FarmerDashboard from './FarmerDashboard';
import WorkerSearchPage from './WorkerSearchPage';
import MachinerySearchPage from './MachinerySearchPage';
import MachineDetailsPage from './MachineDetailsPage';
import NearbyPage from './NearbyPage';
import PostRequirementPage from './PostRequirementPage';
import MyRequirementsPage from './MyRequirementsPage';
import MyMachineryPage from './MyMachineryPage';
import MyWorkerProfilePage from './MyWorkerProfilePage';
import ProfilePage from './ProfilePage';
import AdminDashboard from './AdminDashboard';
import NotFoundPage from './NotFoundPage';

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
