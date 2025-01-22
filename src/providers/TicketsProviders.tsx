'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Category, LostTicket, Ticket, generateTicket } from '@/lib/tickets'

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
  ticketsLimit: 3,
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
  const [ticketsLimit, setTicketsLimit] = useState(3)
  const [lastId, setLastId] = useState<number>(0)
  const [timeTillNextTicket, setTimeTillNextTicket] = useState(2000)

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

  function addTicket() {
    const id = lastId + 1
    if (pendingTickets.length < ticketsLimit) {
      const newTicket = generateTicket(id)
      setLastId(id)
      const randTime = Math.floor(Math.random() * 3000) + 2000
      setTimeTillNextTicket(randTime)
      setPendingTickets([...pendingTickets, newTicket])
    }
  }

  useEffect(() => {
    if (lastId === 0) {
        addTicket()
    } else {
      const timer = setTimeout(() => {
        addTicket()
      }, timeTillNextTicket)

      return () => clearTimeout(timer)
    }

  }, [pendingTickets, timeTillNextTicket])

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
