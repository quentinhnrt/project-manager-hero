'use client'

import { create } from 'zustand'
import { type Ticket, type ScoreState, type GameEvent } from '../types/ticket'
import { generateTicket } from '../utils/ticketGenerator'

interface GameState {
  isPlaying: boolean
  isPaused: boolean
  tickets: Ticket[]
  score: ScoreState
  gameEvents: GameEvent[]
  maxTickets: number
  ticketGenerationInterval: number | null // Ajout de cette ligne

  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  addTicket: (ticket: Ticket) => void
  removeTicket: (ticketId: string) => void
  updateScore: (points: number, isCorrect: boolean) => void
  setMaxTickets: (max: number) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  isPlaying: false,
  isPaused: false,
  tickets: [],
  maxTickets: 3,
  ticketGenerationInterval: null, // Initialisation
  score: {
    currentScore: 0,
    streak: 0,
    multiplier: 1,
    correctAnswers: 0,
    wrongAnswers: 0,
    ratio: 0,
  },
  gameEvents: [],

  startGame: () => {
    // Nettoyage de l'intervalle précédent si existant
    if (get().ticketGenerationInterval) {
      clearInterval(get().ticketGenerationInterval)
    }

    set({
      isPlaying: true,
      isPaused: false,
      tickets: [],
      score: {
        currentScore: 0,
        streak: 0,
        multiplier: 1,
        correctAnswers: 0,
        wrongAnswers: 0,
        ratio: 0,
      },
    })

    const generateNewTicket = () => {
      const { tickets, isPlaying, isPaused, maxTickets } = get()

      if (!isPlaying || isPaused) return
      if (tickets.length >= maxTickets) return

      const newTicket = generateTicket()
      get().addTicket(newTicket)
    }

    // Premier ticket
    generateNewTicket()

    // Générer un nouveau ticket toutes les 5 secondes
    const intervalId = window.setInterval(() => {
      generateNewTicket()
    }, 5000)

    set({ ticketGenerationInterval: intervalId })
  },

  pauseGame: () => {
    const interval = get().ticketGenerationInterval
    if (interval) {
      clearInterval(interval)
    }
    set({
      isPaused: true,
      ticketGenerationInterval: null,
    })
  },

  resumeGame: () => {
    set({ isPaused: false })
    get().startGame()
  },

  endGame: () => {
    const interval = get().ticketGenerationInterval
    if (interval) {
      clearInterval(interval)
    }
    set({
      isPlaying: false,
      ticketGenerationInterval: null,
    })
  },

  setMaxTickets: (max: number) => {
    set({ maxTickets: max })
  },

  addTicket: (ticket) => {
    set((state) => {
      if (state.tickets.length >= state.maxTickets) {
        return state
      }
      return { tickets: [...state.tickets, ticket] }
    })
  },

  removeTicket: (ticketId) => {
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== ticketId),
    }))
  },

  updateScore: (points, isCorrect) => {
    set((state) => {
      const newScore = { ...state.score }

      if (isCorrect) {
        newScore.correctAnswers++
        newScore.streak++
        if (newScore.streak % 5 === 0) {
          newScore.multiplier += 0.5
        }
      } else {
        newScore.wrongAnswers++
        newScore.streak = 0
        newScore.multiplier = 1
      }

      const adjustedPoints = Math.round(points * newScore.multiplier)
      newScore.currentScore += adjustedPoints

      const total = newScore.correctAnswers + newScore.wrongAnswers
      newScore.ratio = total > 0 ? newScore.correctAnswers / total : 0

      return { score: newScore }
    })
  },
}))
