'use client'

import React from 'react'
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { type Ticket } from '@/types/ticket'
import TicketComponent from './Ticket'
import { DropZone } from './DropZone'
import { useGameStore } from '@/stores/gameStore'

export const DragDropContext = () => {
  const { tickets, updateScore, removeTicket } = useGameStore()
  const [activeTicket, setActiveTicket] = React.useState<Ticket | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id)
    setActiveTicket(ticket || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null)
    const { active, over } = event

    if (!over) return

    const ticketId = active.id as string
    const dropZoneType = over.id as string
    const ticket = tickets.find((t) => t.id === ticketId)

    if (!ticket) return

    const isCorrect = ticket.type === dropZoneType
    updateScore(isCorrect ? 100 : -200, isCorrect)
    removeTicket(ticketId)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      {/* Section des tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {tickets.map((ticket) => (
          <TicketComponent
            key={ticket.id}
            ticket={ticket}
            timeLimit={30}
            onTimeout={(id) => {
              updateScore(-200, false)
              removeTicket(id)
            }}
          />
        ))}
      </div>

      {/* Section des zones de dépôt */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DropZone type="bug" />
        <DropZone type="feature" />
        <DropZone type="improvement" />
        <DropZone type="documentation" />
      </div>

      {/* Overlay de drag */}
      <DragOverlay>
        {activeTicket && (
          <div className="transform scale-105 opacity-90">
            <TicketComponent
              ticket={activeTicket}
              timeLimit={30}
              onTimeout={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default DragDropContext
