'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
import { useTicketsContext } from '@/providers/TicketsProviders'

const ScoreBoard = () => {
  const { processedTickets, lostTickets, expiredTickets } = useTicketsContext()

  const stats = useMemo(() => {
    const correctAnswers = processedTickets.length
    const wrongAnswers = lostTickets.length
    const expiredCount = expiredTickets.length
    const totalAttempts = correctAnswers + wrongAnswers + expiredCount
    const ratio = totalAttempts ? correctAnswers / totalAttempts : 0
    const baseScore = correctAnswers * 100
    const penaltyScore = (wrongAnswers + expiredCount) * 50
    const currentScore = Math.max(0, baseScore - penaltyScore)
    const streak = processedTickets.slice(-3).length
    const multiplier = 1 + streak * 0.1

    return {
      correctAnswers,
      wrongAnswers,
      expiredCount,
      ratio,
      currentScore,
      streak,
      multiplier,
    }
  }, [processedTickets, lostTickets, expiredTickets])

  const [displayedScore, setDisplayedScore] = useState(stats.currentScore)

  useEffect(() => {
    if (stats.currentScore !== displayedScore) {
      const step = stats.currentScore > displayedScore ? 10 : -10
      const interval = setInterval(() => {
        setDisplayedScore((prev) => {
          const next = prev + step
          if (
            (step > 0 && next >= stats.currentScore) ||
            (step < 0 && next <= stats.currentScore)
          ) {
            clearInterval(interval)
            return stats.currentScore
          }
          return next
        })
      }, 16)
      return () => clearInterval(interval)
    }
  }, [stats.currentScore, displayedScore])

  return (
    <Card className="bg-card w-full">
      <CardContent className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
        {/* Score and Multipliers */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-2xl md:text-3xl font-bold">
              {displayedScore.toLocaleString()}
            </span>
          </div>

          <div className="hidden md:block">
            <Separator orientation="vertical" className="h-8" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Flame
                className={`h-5 w-5 ${
                  stats.streak > 0 ? 'text-orange-500' : 'text-muted-foreground'
                }`}
              />
              <span className="font-medium">{stats.streak}</span>
            </div>

            <div className="flex items-center gap-1">
              <Star
                className={`h-5 w-5 ${
                  stats.multiplier > 1
                    ? 'text-purple-500'
                    : 'text-muted-foreground'
                }`}
              />
              <span className="font-medium">
                x{stats.multiplier.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            <span className="font-medium">{stats.correctAnswers}</span>
          </div>

          <div className="flex items-center gap-1">
            <ThumbsDown className="h-5 w-5 text-red-500" />
            <span className="font-medium">
              {stats.wrongAnswers + stats.expiredCount}
            </span>
          </div>

          <div className="hidden md:block">
            <Separator orientation="vertical" className="h-8" />
          </div>

          <div className="flex items-center gap-1">
            <span className="font-medium">
              {(stats.ratio * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScoreBoard
