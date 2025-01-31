import {TicketsContextProvider} from "@/providers/TicketsProviders";
import {ScoreContextProvider} from "@/providers/ScoreProvider";

export default function Providers({children}: { children: React.ReactNode }) {
    return (

        <TicketsContextProvider>
            <ScoreContextProvider>
                {children}
            </ScoreContextProvider>
        </TicketsContextProvider>

    );
}