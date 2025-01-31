import {TicketsContextProvider} from "@/providers/TicketsProviders";
import {ScoreContextProvider} from "@/providers/ScoreProvider";
import {SettingsContextProvider} from "@/providers/SettingsProvider";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <SettingsContextProvider>
            <TicketsContextProvider>
                <ScoreContextProvider>
                    {children}
                </ScoreContextProvider>
            </TicketsContextProvider>
        </SettingsContextProvider>
    );
}