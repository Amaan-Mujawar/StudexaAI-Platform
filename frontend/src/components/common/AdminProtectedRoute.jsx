// src/components/common/AdminProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b]">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-xl backdrop-blur-xl">
                    <p className="text-sm font-semibold text-zinc-400 animate-pulse">
                        Verifying Admin Session…
                    </p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    return children;
};

export default AdminProtectedRoute;
