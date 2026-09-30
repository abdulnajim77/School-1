import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { TransportProvider } from './context/TransportContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { GeofenceSimulatorControls } from './components/common/GeofenceSimulatorControls';

// Pages
import { Login } from './pages/Login';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { LiveBusTrackingPage } from './pages/parent/LiveBusTrackingPage';
import { ParentFeesPage } from './pages/parent/ParentFeesPage';
import { ParentAttendancePage } from './pages/parent/ParentAttendancePage';
import { ParentHomeworkPage } from './pages/parent/ParentHomeworkPage';
import { ParentExamRoutinePage } from './pages/parent/ParentExamRoutinePage';
import { ParentNoticesPage } from './pages/parent/ParentNoticesPage';
import { ParentLeaveRequestPage } from './pages/parent/ParentLeaveRequestPage';
import { ParentReportCardPage } from './pages/parent/ParentReportCardPage';
import { ParentActivitiesPage } from './pages/parent/ParentActivitiesPage';
import { ParentSettingsPage } from './pages/parent/ParentSettingsPage';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverRoutePage } from './pages/driver/DriverRoutePage';
import { DriverLeaveDashboard } from './pages/driver/DriverLeaveDashboard';
import { DriverEmergencyPage } from './pages/driver/DriverEmergencyPage';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherAttendancePage } from './pages/teacher/TeacherAttendancePage';
import { TeacherHomeworkPage } from './pages/teacher/TeacherHomeworkPage';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLiveTrackingPage } from './pages/admin/AdminLiveTrackingPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { AdminParentsPage } from './pages/admin/AdminParentsPage';
import { BusManagementPage } from './pages/admin/BusManagementPage';
import { DriverManagementPage } from './pages/admin/DriverManagementPage';
import { RouteManagementPage } from './pages/admin/RouteManagementPage';
import { AdminGeofenceEditorPage } from './pages/admin/AdminGeofenceEditorPage';
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage';
import { AdminFeesPage } from './pages/admin/AdminFeesPage';
import { AdminLeaveRequestsPage } from './pages/admin/AdminLeaveRequestsPage';
import { AdminNoticesPage } from './pages/admin/AdminNoticesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Responsive Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Demo Mode GPS & Geofence Simulator (Always accessible in demo mode) */}
      {isDemoMode && <GeofenceSimulatorControls />}
    </div>
  );
};

const RootRedirect: React.FC = () => {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role === 'parent') return <Navigate to="/parent/dashboard" replace />;
  if (role === 'driver') return <Navigate to="/driver/dashboard" replace />;
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SchoolDataProvider>
            <TransportProvider>
              <AppLayout>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<Login />} />

                {/* Parent Routes */}
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                <Route path="/parent/live-tracking" element={<LiveBusTrackingPage />} />
                <Route path="/parent/fees" element={<ParentFeesPage />} />
                <Route path="/parent/attendance" element={<ParentAttendancePage />} />
                <Route path="/parent/homework" element={<ParentHomeworkPage />} />
                <Route path="/parent/exam-routine" element={<ParentExamRoutinePage />} />
                <Route path="/parent/notices" element={<ParentNoticesPage />} />
                <Route path="/parent/leave" element={<ParentLeaveRequestPage />} />
                <Route path="/parent/report-card" element={<ParentReportCardPage />} />
                <Route path="/parent/activities" element={<ParentActivitiesPage />} />
                <Route path="/parent/settings" element={<ParentSettingsPage />} />

                {/* Driver Routes */}
                <Route path="/driver/dashboard" element={<DriverDashboard />} />
                <Route path="/driver/route" element={<DriverRoutePage />} />
                <Route path="/driver/leave-audit" element={<DriverLeaveDashboard />} />
                <Route path="/driver/emergency" element={<DriverEmergencyPage />} />

                {/* Teacher Routes */}
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
                <Route path="/teacher/homework" element={<TeacherHomeworkPage />} />
                <Route path="/teacher/students" element={<TeacherStudentsPage />} />
                <Route path="/teacher/notices" element={<ParentNoticesPage />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/live-tracking" element={<AdminLiveTrackingPage />} />
                <Route path="/admin/students" element={<StudentManagementPage />} />
                <Route path="/admin/parents" element={<AdminParentsPage />} />
                <Route path="/admin/teachers" element={<TeacherStudentsPage />} />
                <Route path="/admin/buses" element={<BusManagementPage />} />
                <Route path="/admin/drivers" element={<DriverManagementPage />} />
                <Route path="/admin/routes" element={<RouteManagementPage />} />
                <Route path="/admin/geofence-editor" element={<AdminGeofenceEditorPage />} />
                <Route path="/admin/attendance" element={<AdminAttendancePage />} />
                <Route path="/admin/fees" element={<AdminFeesPage />} />
                <Route path="/admin/leaves" element={<AdminLeaveRequestsPage />} />
                <Route path="/admin/notices" element={<AdminNoticesPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />

                {/* Fallback */}
                <Route path="*" element={<RootRedirect />} />
              </Routes>
            </AppLayout>
          </TransportProvider>
        </SchoolDataProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
};

export default App;
