'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { Category, LostTicket, Ticket, generateTicket } from '@/lib/tickets'
import {useSettingsContext} from "@/providers/SettingsProvider";

export type TicketsContextType = {
  pendingTickets: Ticket[]
  expiredTickets: Ticket[]
  processedTickets: Ticket[]
  lostTickets: LostTicket[]
  ticketsLimit: number
  setTicketToLost: (ticket: Ticket, category: Category) => void
  setTicketToExpired: (ticket: Ticket) => void
  setTicketToProcessed: (ticket: Ticket) => void
  setTicketsLimit: (limit: number) => void
}

const TicketsContext = createContext<TicketsContextType>({
  pendingTickets: [],
  expiredTickets: [],
  processedTickets: [],
  lostTickets: [],
  ticketsLimit: 12,
  setTicketToLost: () => {},
  setTicketToExpired: () => {},
  setTicketToProcessed: () => {},
  setTicketsLimit: () => {},
})

function TicketsContextProvider({ children }: { children: React.ReactNode }) {
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([])
  const [expiredTickets, setExpiredTickets] = useState<Ticket[]>([])
  const [processedTickets, setProcessedTickets] = useState<Ticket[]>([])
  const [lostTickets, setLostTickets] = useState<LostTicket[]>([])
  const [ticketsLimit, setTicketsLimit] = useState(getInitialTicketsLimit)
  const [lastId, setLastId] = useState<number>(0)
  const [timeTillNextTicket, setTimeTillNextTicket] = useState(2000)
  const { paused, isHardMode } = useSettingsContext()

  // Function to determine tickets limit based on screen size
  function getInitialTicketsLimit(): number {
    if (typeof window === 'undefined') return 12 // Default for SSR
    return window.innerWidth < 1024 ? 3 : 12
  }

  // Add an effect to update tickets limit on resize
  useEffect(() => {
    function handleResize() {
      setTicketsLimit(getInitialTicketsLimit())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const setTicketToLost = (ticket: Ticket, selectedCategory: Category) => {
    const lostTicket: LostTicket = {
      ...ticket,
      selectedCategory,
    }
    setLostTickets([...lostTickets, lostTicket])
    setPendingTickets(pendingTickets.filter((t) => t.id !== ticket.id))
  }

  const setTicketToExpired = (ticket: Ticket) => {
    setExpiredTickets((prev) => [...prev, ticket])
    setPendingTickets((prev) => prev.filter((t) => t.id !== ticket.id))
  }

  const setTicketToProcessed = (ticket: Ticket) => {
    setProcessedTickets([...processedTickets, ticket])
    setPendingTickets(pendingTickets.filter((t) => t.id !== ticket.id))
  }

  useEffect(() => {
    if (paused) {
      setPendingTickets([])
      setExpiredTickets([])
      setProcessedTickets([])
      setLostTickets([])
    }
  }, [isHardMode]);

  useEffect(() => {
    if (paused) return;
    function addTicket() {
      const id = lastId + 1
      if (pendingTickets.length < ticketsLimit) {
        const newTicket = generateTicket(id, isHardMode)
        setLastId(id)
        const randTime = Math.floor(Math.random() * 1000) + 1500
        setTimeTillNextTicket(randTime)
        setPendingTickets([...pendingTickets, newTicket])
      }
    }

    if (lastId === 0) {
      addTicket()
    } else {
      const timer = setTimeout(() => {
        addTicket()
      }, timeTillNextTicket)

      return () => clearTimeout(timer)
    }

  }, [lastId, pendingTickets, ticketsLimit, timeTillNextTicket, paused])

  return (
    <TicketsContext.Provider
      value={{
        pendingTickets,
        expiredTickets,
        processedTickets,
        lostTickets,
        ticketsLimit,
        setTicketToLost,
        setTicketToExpired,
        setTicketToProcessed,
        setTicketsLimit,
      }}
    >
      {children}
    </TicketsContext.Provider>
  )
}

const useTicketsContext = () => {
  return useContext(TicketsContext)
}

export { TicketsContextProvider, useTicketsContext }