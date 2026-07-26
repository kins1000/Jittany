import { useEffect, useState } from "react";

const LEVEL_DURATION = 8 * 60; // 8 minutes


const blindLevels = [
    { level: 1, small: 25, big: 50 },
    { level: 2, small: 50, big: 100 },
    { level: 3, small: 75, big: 150 },
    { level: 4, small: 100, big: 200 },
    { level: 5, small: 200, big: 400 },
    { level: 6, small: 300, big: 600 },
    { level: 7, small: 500, big: 1000 },
    { level: 8, small: 1000, big: 2000 },
];

export default function PokerTimer() {
    const [secondsRemaining, setSecondsRemaining] =
        useState(LEVEL_DURATION);

    const [currentLevel, setCurrentLevel] =
        useState(0);

    const [running, setRunning] =
        useState(false);



    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setSecondsRemaining((prev) => {
                if (prev > 1) {
                    return prev - 1;
                }

                setCurrentLevel((level) =>
                    Math.min(
                        level + 1,
                        blindLevels.length - 1
                    )
                );

                return LEVEL_DURATION;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);

    const minutes = Math.floor(
        secondsRemaining / 60
    );

    const seconds = secondsRemaining % 60;

    const level =
        blindLevels[currentLevel];

    const handleReset = () => {
        setRunning(false);
        setCurrentLevel(0);
        setSecondsRemaining(LEVEL_DURATION);
    };

    return (
        <div className="space-y-6">
            <h3 className="font-display font-bold text-lg">
                Tournament Clock
            </h3>

            <div className="text-center">
                <div className="text-5xl font-bold tabular-nums">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                </div>

                <div className="mt-2 text-muted-foreground">
                    Level {level.level}
                </div>

                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={() =>
                            setRunning(!running)
                        }
                        className="px-4 py-2 rounded bg-primary text-primary-foreground"
                    >
                        {running ? "Pause" : "Start"}
                    </button>

                    <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded border"
                    >
                        Reset
                    </button>
                </div>

            </div>

            <div className="rounded-xl border overflow-hidden">
                <table className="w-full">
                    <thead>
                    <tr className="bg-muted">
                        <th className="p-3 text-center">
                            Level
                        </th>
                        <th className="p-3 text-center">
                            Small Blind
                        </th>
                        <th className="p-3 text-center">
                            Big Blind
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {blindLevels.map((blind, index) => (
                        <tr
                            key={blind.level}
                            className={
                                index === currentLevel
                                    ? "bg-primary/10 font-bold"
                                    : ""
                            }
                        >
                            <td className="border-t p-2 text-center">
                                {blind.level}
                            </td>

                            <td className="border-t p-2 text-center">
                                {blind.small.toLocaleString()}
                            </td>

                            <td className="border-t p-2 text-center">
                                {blind.big.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}