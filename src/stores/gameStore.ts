import { create } from 'zustand'
import { type Ticket, type ScoreState, type GameEvent } from '@/types/ticket'
import { generateTicket } from '@/utils/ticketGenerator'

interface GameState {
  // États
  isPlaying: boolean
  isPaused: boolean
  tickets: Ticket[]
  score: ScoreState
  gameEvents: GameEvent[]
  difficulty: 'easy' | 'medium' | 'hard'
  ticketGenerationInterval: number

  // Actions de jeu
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void

  // Actions de tickets
  addTicket: (ticket: Ticket) => void
  removeTicket: (ticketId: string) => void
  clearTickets: () => void

  // Actions de score
  updateScore: (points: number, isCorrect: boolean) => void
  resetScore: () => void
  addGameEvent: (event: GameEvent) => void
}

// Configuration par niveau de difficulté
const difficultySettings = {
  easy: {
    interval: 8000, // 8 secondes entre les tickets
    timeLimit: 30, // 30 secondes par ticket
    maxTickets: 5, // Maximum 5 tickets à l'écran
  },
  medium: {
    interval: 5000, // 5 secondes entre les tickets
    timeLimit: 20, // 20 secondes par ticket
    maxTickets: 8, // Maximum 8 tickets à l'écran
  },
  hard: {
    interval: 3000, // 3 secondes entre les tickets
    timeLimit: 15, // 15 secondes par ticket
    maxTickets: 10, // Maximum 10 tickets à l'écran
  },
}

export const useGameStore = create<GameState>((set, get) => ({
  // États initiaux
  isPlaying: false,
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
  gameEvents: [],
  difficulty: 'medium',
  ticketGenerationInterval: difficultySettings.medium.interval,

  // Actions de jeu
  startGame: () => {
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
      gameEvents: [],
    })

    // Démarrer la génération de tickets
    const difficulty = get().difficulty
    const settings = difficultySettings[difficulty]

    const generateNewTicket = () => {
      const { tickets, isPlaying, isPaused } = get()

      if (!isPlaying || isPaused) return
      if (tickets.length >= settings.maxTickets) return

      const newTicket = generateTicket()
      get().addTicket(newTicket)
    }

    // Premier ticket
    generateNewTicket()

    // Configurer l'intervalle
    const intervalId = setInterval(generateNewTicket, settings.interval)

    // Stocker l'ID de l'intervalle pour pouvoir l'arrêter plus tard
    set({ ticketGenerationInterval: intervalId as unknown as number })
  },

  pauseGame: () => {
    set({ isPaused: true })
    clearInterval(get().ticketGenerationInterval)
  },

  resumeGame: () => {
    set({ isPaused: false })
    get().startGame() // Redémarre la génération de tickets
  },

  endGame: () => {
    set({ isPlaying: false })
    clearInterval(get().ticketGenerationInterval)
    get().clearTickets()
  },

  setDifficulty: (difficulty) => {
    set({
      difficulty,
      ticketGenerationInterval: difficultySettings[difficulty].interval,
    })
  },

  // Actions de tickets
  addTicket: (ticket) => {
    set((state) => ({
      tickets: [...state.tickets, ticket],
    }))
  },

  removeTicket: (ticketId) => {
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== ticketId),
    }))
  },

  clearTickets: () => {
    set({ tickets: [] })
  },

  // Actions de score
  updateScore: (points, isCorrect) => {
    set((state) => {
      const newScore = { ...state.score }

      if (isCorrect) {
        newScore.correctAnswers++
        newScore.streak++

        // Augmentation du multiplicateur tous les 5 tickets
        if (newScore.streak % 5 === 0) {
          newScore.multiplier += 0.5
        }
      } else {
        newScore.wrongAnswers++
        newScore.streak = 0
        newScore.multiplier = 1
      }

      // Calcul du score avec multiplicateur
      const adjustedPoints = Math.round(points * newScore.multiplier)
      newScore.currentScore += adjustedPoints

      // Calcul du ratio
      const total = newScore.correctAnswers + newScore.wrongAnswers
      newScore.ratio = total > 0 ? newScore.correctAnswers / total : 0

      // Ajout de l'événement
      const event: GameEvent = {
        type: isCorrect ? 'success' : 'error',
        message: `${isCorrect ? '+' : ''}${adjustedPoints} points (x${newScore.multiplier.toFixed(1)})`,
        points: adjustedPoints,
      }

      return {
        score: newScore,
        gameEvents: [event, ...state.gameEvents].slice(0, 5), // Garde les 5 derniers événements
      }
    })
  },

  resetScore: () => {
    set({
      score: {
        currentScore: 0,
        streak: 0,
        multiplier: 1,
        correctAnswers: 0,
        wrongAnswers: 0,
        ratio: 0,
      },
      gameEvents: [],
    })
  },

  addGameEvent: (event) => {
    set((state) => ({
      gameEvents: [event, ...state.gameEvents].slice(0, 5),
    }))
  },
}))
