'use client'

import {createContext, useContext, useEffect, useState} from "react";
import {useTicketsContext} from "@/providers/TicketsProviders";

type ScoreContextType = {
    score: number;
    multiplier: number;
    streak: number;
    ratio: number;
}

const ScoreContext = createContext<ScoreContextType>({
    score: 0,
    multiplier: 1,
    streak: 0,
    ratio: 100
});

function ScoreContextProvider({children}: { children: React.ReactNode }) {
    const {processedTickets, lostTickets, expiredTickets} = useTicketsContext();
    const [score, setScore] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [streak, setStreak] = useState(0);
    const [ratio, setRatio] = useState(100);
    const scoreAmount = 100;

    useEffect(() => {
        const wrongTickets = lostTickets.length + expiredTickets.length;
        const rightTickets = processedTickets.length;

        if (wrongTickets === 0) {
            setRatio(100);
            return;
        }

        setRatio((rightTickets / wrongTickets) * 100);
    }, [processedTickets, lostTickets, expiredTickets]);

    useEffect(() => {
        if (processedTickets.length === 0) {
            return;
        }
        setMultiplier(multiplier + 0.1);
        setScore(score + scoreAmount * multiplier);
        setStreak(streak + 1);
    }, [processedTickets]);

    useEffect(() => {
        if (lostTickets.length === 0 && expiredTickets.length === 0) {
            return;
        }
        setMultiplier(1);
        setStreak(0);

        if (score === 0) {
            return;
        }

        const currentScore = score - scoreAmount;

        if (currentScore < 0) {
            setScore(0);
            return;
        }

        setScore(currentScore);
    }, [lostTickets, expiredTickets]);


    return <ScoreContext.Provider value={
        {
            score,
            multiplier,
            streak,
            ratio
        }
    }>{children}</ScoreContext.Provider>;
}

const useScoreContext = () => {
    return useContext(ScoreContext);
}

export {ScoreContextProvider, useScoreContext};

