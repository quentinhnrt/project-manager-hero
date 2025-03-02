'use client'

import { Category, Ticket } from '@/lib/tickets'
import { useTicketsContext } from '@/providers/TicketsProviders'
import React, { useState, useEffect, useRef } from 'react'
import {useSettingsContext} from "@/providers/SettingsProvider";

interface TicketProps extends Ticket {
  onDragStart: (e: React.DragEvent, category: Category) => void
}

export default function TicketComponent({ ...ticket }: TicketProps) {
  const { setTicketToLost, setTicketToProcessed } = useTicketsContext()
  const [isBlur, setIsBlur] = useState(true)
  const [isTimerStarted, setIsTimerStarted] = useState(false)
  const isExpiring = useRef(false)
  const [timeLeft, setTimeLeft] = useState(ticket.timeToProcess)
  const [isExploding, setIsExploding] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { paused } = useSettingsContext()

  const { setTicketToExpired } = useTicketsContext()

  useEffect(() => {
    const blurTimer = setTimeout(() => {
      setIsBlur(false)
      setIsTimerStarted(true)
    }, 1000)

    return () => clearTimeout(blurTimer)
  }, [])

  useEffect(() => {
    if (!isTimerStarted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (paused) {
            return prev
        }

        if (prev <= 1 && !isExpiring.current) {
          isExpiring.current = true
          setIsExploding(true)
          setTimeout(() => {
            setIsVisible(false)
            setTicketToExpired(ticket)
          }, 500)
          clearInterval(timer)
          return 0
        }
        return Math.max(0, prev - 1)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerStarted, setTicketToExpired, ticket])

  const handleCategoryClick = (category: Category) => {
    if (!isBlur) {
      if (ticket.category === category) {
        setTicketToProcessed(ticket)
      } else {
        setTicketToLost(ticket, category)
      }
    }
  }

  const getPriorityColor = () => {
    switch (ticket.priority) {
      case 'critical':
        return 'bg-red-600'
      case 'major':
        return 'bg-orange-600'
      case 'medium':
        return 'bg-yellow-600'
      default:
        return 'bg-green-600'
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`w-full h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all ${
        isBlur ? 'cursor-pointer' : 'cursor-move'
      }`}
      style={{
        filter: isBlur ? 'blur(5px)' : 'none',
        transition: 'filter 0.3s ease-out',
      }}
    >
      <div
        className={`w-full flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all ${isBlur ? 'cursor-pointer' : 'cursor-move'}`}
        style={{
          filter: isBlur ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease-out',
        }}
      >
        <style jsx>{`
          .spark {
            position: absolute;
            border-radius: 50%;
            animation: explode 0.8s ease-out forwards;
          }

          .small-spark {
            width: 8px;
            height: 8px;
          }

          .medium-spark {
            width: 12px;
            height: 12px;
          }

          .large-spark {
            width: 16px;
            height: 16px;
          }

          @keyframes explode {
            0% {
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx), var(--ty)) scale(0) rotate(180deg);
              opacity: 0;
            }
          }

          @keyframes fadeOut {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.8);
            }
          }
        `}</style>

        <div
          id={ticket.id.toString()}
          draggable={!isBlur}
          onDragStart={(e) => !isBlur && ticket.onDragStart(e, ticket.category)}
          className={`relative p-2 lg:p-4 w-full transition-all flex flex-col justify-between h-full
           ${isExploding ? 'animate-[fadeOut_0.5s_ease-out_forwards]' : ''}`}
        >
          {isExploding && (
            <>
              {[...Array(40)].map((_, i) => {
                const angle = (i / 40) * Math.PI * 2
                const distance = 150 + Math.random() * 100
                const tx = Math.cos(angle) * distance
                const ty = Math.sin(angle) * distance
                const delay = Math.random() * 0.3
                const colors = [
                  '#FF4136',
                  '#FF851B',
                  '#FFDC00',
                  '#FFD700',
                  '#FFA500',
                ]
                const color = colors[Math.floor(Math.random() * colors.length)]
                const sizes = ['small-spark', 'medium-spark', 'large-spark']
                const sparkSize =
                  sizes[Math.floor(Math.random() * sizes.length)]

                return (
                  <div
                    key={i}
                    className={`spark ${sparkSize}`}
                    style={
                      {
                        '--tx': `${tx}px`,
                        '--ty': `${ty}px`,
                        backgroundColor: color,
                        left: '50%',
                        top: '50%',
                        animationDelay: `${delay}s`,
                      } as React.CSSProperties
                    }
                  />
                )
              })}
            </>
          )}

          <div className="flex justify-between items-center mb-2">
            <div className="h-1 bg-gray-200 rounded-full w-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / ticket.timeToProcess) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-500 ml-2">{timeLeft}s</span>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2 min-h-10">
            {ticket.description}
          </p>
          <div className="mt-1 text-gray-400 text-xs">
            #{ticket.id}
            <span
              className={`${getPriorityColor()} text-xs rounded-sm px-4 py-1 ml-2 font-medium text-white`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>
        <div className="lg:hidden flex flex-wrap gap-2 justify-center">
          {['support', 'feature', 'technical', 'bug'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category as Category)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isBlur ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                category === 'support'
                  ? 'bg-mint-100 text-mint-800 hover:bg-mint-200'
                  : category === 'feature'
                    ? 'bg-lime-100 text-lime-800 hover:bg-lime-200'
                    : category === 'technical'
                      ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
              disabled={isBlur}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
