'use client'

import React from 'react'
import { useGameStore } from '@/stores/gameStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Trophy,
  ThumbsUp,
  ThumbsDown,
  Percent,
  Flame,
  Star,
} from 'lucide-react'

export const ScoreBoard = () => {
  const { score } = useGameStore()
  const {
    currentScore,
    streak,
    multiplier,
    correctAnswers,
    wrongAnswers,
    ratio,
  } = score

  const [displayedScore, setDisplayedScore] = React.useState(currentScore)

  React.useEffect(() => {
    if (currentScore !== displayedScore) {
      const step = currentScore > displayedScore ? 10 : -10
      const interval = setInterval(() => {
        setDisplayedScore((prev) => {
          const next = prev + step
          if (
            (step > 0 && next >= currentScore) ||
            (step < 0 && next <= currentScore)
          ) {
            clearInterval(interval)
            return currentScore
          }
          return next
        })
      }, 16)

      return () => clearInterval(interval)
    }
  }, [currentScore, displayedScore])

  return (
    <Card className="bg-card">
      <CardContent className="flex items-center justify-between p-4">
        {/* Score */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">
              {displayedScore.toLocaleString()}
            </span>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Série et multiplicateur */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Flame
                className={`h-4 w-4 ${
                  streak > 0 ? 'text-orange-500' : 'text-muted-foreground'
                }`}
              />
              <span className="font-medium">{streak}</span>
              <Badge variant="secondary" className="ml-1">
                Série
              </Badge>
            </div>

            <div className="flex items-center space-x-1">
              <Star
                className={`h-4 w-4 ${
                  multiplier > 1 ? 'text-purple-500' : 'text-muted-foreground'
                }`}
              />
              <span className="font-medium">x{multiplier.toFixed(1)}</span>
              <Badge variant="outline" className="ml-1">
                Multi
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4 text-green-500" />
            <span className="font-medium">{correctAnswers}</span>
          </div>

          <div className="flex items-center space-x-1">
            <ThumbsDown className="h-4 w-4 text-red-500" />
            <span className="font-medium">{wrongAnswers}</span>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center space-x-1">
            <Percent className="h-4 w-4 text-primary" />
            <span className="font-medium">{(ratio * 100).toFixed(0)}%</span>
            <Badge variant="outline" className="ml-1">
              Ratio
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScoreBoard
