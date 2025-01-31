'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Trophy,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Star,
} from 'lucide-react'
import {useScoreContext} from "@/providers/ScoreProvider";
import {useTicketsContext} from "@/providers/TicketsProviders";

const ScoreBoard = () => {
  const { score, multiplier, streak, ratio } = useScoreContext()
  const { processedTickets, lostTickets, expiredTickets } = useTicketsContext()


  return (
    <Card className="bg-card w-full max-w-7xl mx-auto">
      <CardContent className="flex flex-row items-center justify-between p-2 pb-0 md:p-4 gap-4">
        {/* Score and Multipliers */}
        <div className="flex flex-row gap-2 items-center md:gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-2xl md:text-3xl font-bold">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="hidden md:block">
            <Separator orientation="vertical" className="h-8" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Flame
                className={`h-5 w-5 ${
                  streak > 0 ? 'text-orange-500' : 'text-muted-foreground'
                }`}
              />
              <span className="font-medium">{streak}</span>
            </div>

            <div className="flex items-center gap-1">
              <Star
                className={`h-5 w-5 ${
                  multiplier > 1
                    ? 'text-purple-500'
                    : 'text-muted-foreground'
                }`}
              />
              <span className="font-medium">
                x{multiplier.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            <span className="font-medium">{processedTickets.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <ThumbsDown className="h-5 w-5 text-red-500" />
            <span className="font-medium">
              {lostTickets.length + expiredTickets.length}
            </span>
          </div>

          <div className="hidden md:block">
            <Separator orientation="vertical" className="h-8" />
          </div>

          <div className="items-center gap-1 hidden md:flex">
            <span className="font-medium">
              {ratio.toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScoreBoard
