'use client'

import { useDroppable } from '@dnd-kit/core'
import { type TicketType } from '@/types/ticket'

interface DropZoneProps {
  type: TicketType
  children?: React.ReactNode
}

export const DropZone = ({ type, children }: DropZoneProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: type,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        p-4 rounded-lg border-2 border-dashed
        transition-colors duration-200
        min-h-[200px]
        ${isOver ? 'border-primary bg-primary/10' : 'border-gray-200'}
      `}
    >
      <div className="text-center mb-4 font-medium capitalize">{type}</div>
      {children}
    </div>
  )
}

export default DropZone
