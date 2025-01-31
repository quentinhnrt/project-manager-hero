'use client'

import { CategoryCard } from '@/components/category-card'
import ScoreBoard from '@/components/score-board'
import TicketComponent from '@/components/ticket'
import { Category, Ticket } from '@/lib/tickets'
import { useTicketsContext } from '@/providers/TicketsProviders'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from 'react'

export default function Home() {
  const {
    pendingTickets,
    setTicketToLost,
    setTicketToProcessed,
  } = useTicketsContext()

  const handleDragStart = (e: React.DragEvent, category: Category) => {
    e.dataTransfer.setData('category', category)
    const ticketId = parseInt(e.currentTarget.id)
    e.dataTransfer.setData('ticketId', ticketId.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetCategory: Category) => {
    e.preventDefault()
    const draggedCategory = e.dataTransfer.getData('category') as Category
    const ticketId = parseInt(e.dataTransfer.getData('ticketId'))

    const ticket = pendingTickets.find((t) => t.id === ticketId)
    if (!ticket) return

    if (draggedCategory === targetCategory) {
      setTicketToProcessed(ticket)
    } else {
      setTicketToLost(ticket, targetCategory)
    }
  }

  return (
    <main className="min-h-screen gap-2 lg:gap-0 p-0 lg:p-4 flex flex-col items-center lg:justify-between">
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Project Manager Hero</AlertDialogTitle>
          <AlertDialogDescription>
            Bienvenue sur notre jeu de tri de ticket ou le but est de trier les tickets en fonction de leur catégorie. Afin d'avoir le meilleur score possible. Un système de multiplicateur est en place pour augmenter votre score.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Jouer</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      <ScoreBoard />
      <div className="grid grid-rows-3 gap-2 max-h-[360px] overflow-hidden items-center w-full bg-slate-100 p-2 lg:p-4 rounded-lg lg:max-h-none lg:overflow-auto lg:grid-cols-4 lg:grid-rows-4 lg:gap-4 ">
        {pendingTickets.length === 0 ? (
          <p className='text-lg font-bold'>Il n&apos;y a plus de ticket à traiter</p>
        ) : (
          pendingTickets.map((ticket: Ticket) => (
            <TicketComponent
              key={ticket.id}
              {...ticket}
              onDragStart={handleDragStart}
            />
          ))
        )}
      </div>

      <div className="gap-1 px-2 md:px-0 grid grid-rows-2 grid-cols-2 lg:grid-cols-4 lg:grid-rows-1 lg:gap-4 w-full lg:min-h-72">
        {['support', 'feature', 'technical', 'bug'].map((category) => (
          <CategoryCard
            key={category}
            category={category as Category}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category as Category)}
          />
        ))}
      </div>
    </main>
  )
}
