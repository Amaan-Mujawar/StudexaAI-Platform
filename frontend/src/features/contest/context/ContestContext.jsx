// src/features/contest/context/ContestContext.jsx
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket.js";
import {
    fetchLeaderboard,
    fetchUserContestStats,
    startContest as apiStartContest,
    submitContest as apiSubmitContest,
} from "../services/contestApi.js";

const ContestContext = createContext(null);

export const ContestProvider = ({ children }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ── Connect Socket.io once, using the module singleton ── */
    useEffect(() => {
        const socket = connectSocket();

        const handleLeaderboardUpdate = ({ leaderboard: newBoard }) => {
            setLeaderboard(newBoard ?? []);
        };

        socket.on("leaderboard:update", handleLeaderboardUpdate);

        // Cleanup: only remove the listener, don't kill the socket.
        // The singleton persists across StrictMode double-mounts.
        return () => {
            socket.off("leaderboard:update", handleLeaderboardUpdate);
        };
    }, []);

    /* ── Fetch leaderboard ── */
    const loadLeaderboard = useCallback(async () => {
        try {
            const { data } = await fetchLeaderboard(20);
            setLeaderboard(data.leaderboard ?? []);
        } catch { /* silent */ }
    }, []);

    /* ── Fetch user stats ── */
    const loadUserStats = useCallback(async () => {
        try {
            const { data } = await fetchUserContestStats();
            setUserStats(data);
        } catch { /* silent */ }
    }, []);

    /* ── Start contest ── */
    const startContest = useCallback(async (topic) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiStartContest(topic);
            return data; // { message, attempt }
        } catch (err) {
            const msg = err?.message || "Failed to start contest.";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Submit answers ── */
    const submitContest = useCallback(async (attemptId, answers) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiSubmitContest(attemptId, answers);
            loadUserStats();
            return data;
        } catch (err) {
            const msg = err?.message || "Failed to submit contest.";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }, [loadUserStats]);

    return (
        <ContestContext.Provider value={{
            leaderboard, userStats, loading, error,
            loadLeaderboard, loadUserStats,
            startContest, submitContest,
        }}>
            {children}
        </ContestContext.Provider>
    );
};

export const useContest = () => {
    const ctx = useContext(ContestContext);
    if (!ctx) throw new Error("useContest must be used inside ContestProvider");
    return ctx;
};
