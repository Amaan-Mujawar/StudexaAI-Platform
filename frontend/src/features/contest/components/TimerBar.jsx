/* src/features/contest/components/TimerBar.jsx
   Animated countdown bar — counts from maxSecs down to 0.
   Calls onExpire() when time runs out.
*/
import { useEffect, useRef, useState } from "react";

const TimerBar = ({ maxSecs = 30, questionKey, onExpire }) => {
    const [remaining, setRemaining] = useState(maxSecs);
    const intervalRef = useRef(null);
    const expiredRef = useRef(false);

    /* Reset whenever the question changes */
    useEffect(() => {
        setRemaining(maxSecs);
        expiredRef.current = false;
    }, [questionKey, maxSecs]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setRemaining((r) => {
                if (r <= 1) {
                    clearInterval(intervalRef.current);
                    if (!expiredRef.current) {
                        expiredRef.current = true;
                        onExpire?.();
                    }
                    return 0;
                }
                return r - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [questionKey, onExpire]);

    const pct = (remaining / maxSecs) * 100;

    /* Colour shifts: green → yellow → red */
    const barColor =
        pct > 50
            ? "from-emerald-400 to-green-500"
            : pct > 25
                ? "from-yellow-400 to-amber-500"
                : "from-red-400 to-rose-600";

    return (
        <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-muted">Time Remaining</span>
                <span
                    className={`tabular-nums ${remaining <= 8 ? "text-red-500 animate-pulse" : "text-text-title"}`}
                >
                    {remaining}s
                </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-linear`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

export default TimerBar;
