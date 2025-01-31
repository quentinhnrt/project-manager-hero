'use client'
import {createContext, useContext, useState} from "react";

type SettingsContextType = {
    paused: boolean;
    setPaused: (paused: boolean) => void;
    isHardMode: boolean;
    setIsHardMode: (isHardMode: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
    paused: true,
    setPaused: () => {},
    isHardMode: false,
    setIsHardMode: () => {}
})

function SettingsContextProvider( {children}: {children: React.ReactNode} ) {
    const [paused, setPaused] = useState(true);
    const [isHardMode, setIsHardMode] = useState(false);

    return (
        <SettingsContext.Provider value={{paused, setPaused, isHardMode, setIsHardMode}}>
            {children}
        </SettingsContext.Provider>
    )
}

const useSettingsContext = () => {
    return useContext(SettingsContext)
}

export {SettingsContextProvider, useSettingsContext}