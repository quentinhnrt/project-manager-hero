import {TicketsContextProvider} from "@/providers/TicketsProviders";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TicketsContextProvider>
            {children}
        </TicketsContextProvider>
    );
}