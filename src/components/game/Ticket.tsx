'use client'

import React, { useState, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Timer, AlertCircle, Star, ArrowUp } from 'lucide-react'
import { type Ticket } from '@/types/ticket'

interface TicketProps {
  ticket: Ticket
  timeLimit: number
  onTimeout: (ticketId: string) => void
}

const TicketComponent = ({ ticket, timeLimit, onTimeout }: TicketProps) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isVisible, setIsVisible] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: ticket.id,
    })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  useEffect(() => {
    setIsVisible(true)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeout(ticket.id)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [ticket.id, onTimeout])

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  }

  const typeIcons = {
    bug: <AlertCircle className="h-4 w-4" />,
    feature: <Star className="h-4 w-4" />,
    improvement: <ArrowUp className="h-4 w-4" />,
    documentation: <Timer className="h-4 w-4" />,
  }

  const timePercentage = (timeLeft / timeLimit) * 100

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none"
    >
      <Card
        className={`
        relative
        transform transition-all duration-300
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        ${isDragging ? 'opacity-50 cursor-grabbing' : 'opacity-100 cursor-grab hover:scale-105'}
        ${timePercentage < 30 ? 'animate-pulse' : ''}
      `}
      >
        <div className="absolute top-0 left-0 w-full">
          <Progress
            value={timePercentage}
            className={`h-1 rounded-t-lg ${
              timePercentage < 30
                ? 'bg-red-500'
                : timePercentage < 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }`}
          />
        </div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <span className={`p-1 rounded ${priorityColors[ticket.priority]}`}>
              {typeIcons[ticket.type]}
            </span>
            <span className="font-semibold text-sm">
              #{ticket.id.slice(-4)}
            </span>
          </div>
          <Badge variant="outline" className={priorityColors[ticket.priority]}>
            {ticket.priority}
          </Badge>
        </CardHeader>

        <CardContent>
          <h3 className="font-medium mb-2 line-clamp-2">{ticket.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {ticket.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {ticket.labels.map((label) => (
              <Badge key={label} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <Badge variant="outline" className="text-xs">
              {ticket.storyPoints} pts
            </Badge>
            <span
              className={`text-sm font-medium ${
                timeLeft < timeLimit * 0.3
                  ? 'text-red-500 animate-pulse'
                  : timeLeft < timeLimit * 0.6
                    ? 'text-yellow-500'
                    : 'text-green-500'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TicketComponent
