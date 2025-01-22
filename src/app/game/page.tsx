'use client'

import { ScoreBoard } from '@/components/game/ScoreBoard'
import { DragDropContext } from '@/components/game/DragDropContext'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/gameStore'

export default function GamePage() {
  const { isPlaying, startGame, endGame } = useGameStore()

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-2">
        <div className="flex justify-between items-center gap-4">
          <ScoreBoard />
          <Button
            onClick={() => (isPlaying ? endGame() : startGame())}
            variant={isPlaying ? 'destructive' : 'default'}
            className="absolute bottom-0 right-0"
          >
            {isPlaying ? 'Terminer la partie' : 'Démarrer la partie'}
          </Button>
        </div>
      </div>

      <div className="pb-4">
        <DragDropContext />
      </div>
    </div>
  )
}
