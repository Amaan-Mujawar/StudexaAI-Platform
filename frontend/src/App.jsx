// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";

/* ================= PROVIDERS ================= */
import { AuthProvider } from "./context/AuthContext.jsx";
import { SidebarHistoryProvider } from "./context/SidebarHistoryContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

/* ================= AUTH / ROUTE PROTECTION ================= */
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute.jsx";

/* ================= LAYOUTS ================= */
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

/* ================= LANDING ================= */
import LandingPage from "./pages/Landing/LandingPage.jsx";
import AboutPage from "./pages/Landing/AboutPage.jsx";
import ContactPage from "./pages/Landing/ContactPage.jsx";
import UseCasesPage from "./pages/Landing/UseCasesPage.jsx";

/* ================= LEGAL ================= */
import PrivacyPolicyPage from "./pages/Landing/PrivacyPolicyPage.jsx";
import TermsPage from "./pages/Landing/TermsPage.jsx";
import CopyrightPage from "./pages/Landing/CopyrightPage.jsx";

/* ================= USE CASE PAGES ================= */
import AiTodoUseCasePage from "./pages/Landing/usecases/AiTodoUseCasePage.jsx";
import AiNoteUseCasePage from "./pages/Landing/usecases/AiNoteUseCasePage.jsx";
import AiQuizUseCasePage from "./pages/Landing/usecases/AiQuizUseCasePage.jsx";
import AptitudeUseCasePage from "./pages/Landing/usecases/AptitudeUseCasePage.jsx";
import LogicalReasoningUseCasePage from "./pages/Landing/usecases/LogicalReasoningUseCasePage.jsx";
import VerbalReasoningUseCasePage from "./pages/Landing/usecases/VerbalReasoningUseCasePage.jsx";

/* ================= AUTH PAGES ================= */
import RegisterPage from "./pages/Register/RegisterPage.jsx";
import RegisterOtpPage from "./pages/Register/RegisterOtpPage.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage.jsx";
import ForgotPasswordOtpPage from "./pages/Login/ForgotPasswordOtpPage.jsx";
import ResetPasswordPage from "./pages/Login/ResetPasswordPage.jsx";

/* ================= USER DASHBOARD ================= */
import UserDashboard from "./pages/UserDashboard/UserDashboard.jsx";
import AiTodoPage from "./pages/AiTodo/AiTodoPage.jsx";
import AiNotesPage from "./features/aiNotes/pages/AiNotesPage.jsx";
import AiQuizPage from "./features/aiQuiz/pages/AiQuizPage.jsx";
import AptitudePage from "./features/aptitude/pages/AptitudePage.jsx";
import LogicalReasoningPage from "./features/logicalReasoning/pages/LogicalReasoningPage.jsx";
import VerbalReasoningPage from "./features/verbalReasoning/pages/VerbalReasoningPage.jsx";
import ResourcesPage from "./pages/Resources/ResourcesPage.jsx";
import UserSettingsPage from "./pages/UserDashboard/UserSettings.jsx";
import ContestPage from "./features/contest/pages/ContestPage.jsx";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import AdminUsers from "./pages/Admin/Users.jsx";
import AdminContent from "./pages/Admin/Content.jsx";
import AdminSettings from "./pages/Admin/Settings.jsx";
import AdminTickets from "./pages/Admin/Tickets.jsx";
import MyTickets from "./pages/UserDashboard/MyTickets.jsx";

/* ================= CORE APP ================= */
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarHistoryProvider>
          <Routes>
            {/* ================= LANDING ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />

            {/* ================= USE CASES ================= */}
            <Route path="/use-cases/ai-todo" element={<AiTodoUseCasePage />} />
            <Route path="/use-cases/ai-note" element={<AiNoteUseCasePage />} />
            <Route path="/use-cases/ai-quiz" element={<AiQuizUseCasePage />} />
            <Route path="/use-cases/aptitude" element={<AptitudeUseCasePage />} />
            <Route
              path="/use-cases/logical-reasoning"
              element={<LogicalReasoningUseCasePage />}
            />
            <Route
              path="/use-cases/verbal-reasoning"
              element={<VerbalReasoningUseCasePage />}
            />

            {/* ================= LEGAL ================= */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/copyright" element={<CopyrightPage />} />

            {/* ================= AUTH ================= */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/otp" element={<RegisterOtpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/login/forgot-password/otp"
              element={<ForgotPasswordOtpPage />}
            />
            <Route path="/login/reset-password" element={<ResetPasswordPage />} />

            {/* ================= USER DASHBOARD ================= */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="ai-todo" element={<AiTodoPage />} />
              <Route path="ai-note" element={<AiNotesPage />} />
              <Route path="ai-quiz/*" element={<AiQuizPage />} />
              <Route path="aptitude/*" element={<AptitudePage />} />
              <Route path="logical-reasoning/*" element={<LogicalReasoningPage />} />
              <Route path="verbal-reasoning/*" element={<VerbalReasoningPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="settings" element={<UserSettingsPage />} />
              <Route path="tickets" element={<MyTickets />} />
              <Route path="contest/*" element={<ContestPage />} />
            </Route>

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="tests" element={<AdminContent />} />
              <Route path="upload" element={<AdminContent />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="tickets" element={<AdminTickets />} />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SidebarHistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;