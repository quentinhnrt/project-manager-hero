"use client";

import { Category, Ticket } from "@/lib/tickets";
import { useTicketsContext } from "@/providers/TicketsProviders";
import React, { useState, useEffect } from "react";

interface TicketProps extends Ticket {
  onDragStart: (e: React.DragEvent, category: Category) => void;
}

export default function TicketComponent({ ...ticket }: TicketProps) {
  const [timeLeft, setTimeLeft] = useState(ticket.timeToProcess);
  const [isExploding, setIsExploding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { setTicketToExpired } = useTicketsContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExploding(true);
          setTimeout(() => setIsVisible(false), 800);
          setTicketToExpired(ticket);
        }
        return Math.max(0, prev - 1);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getPriorityColor = () => {
    switch (ticket.priority) {
      case "critical":
        return "bg-red-600";
      case "major":
        return "bg-orange-600";
      case "medium":
        return "bg-yellow-600";
      default:
        return "bg-green-600";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
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
        draggable
        onDragStart={(e) => ticket.onDragStart(e, ticket.category)}
        className={`relative p-4 w-full cursor-move transition-all flex flex-col justify-between h-full ${
          isExploding ? "animate-[fadeOut_0.5s_ease-out_forwards]" : ""
        }`}
      >
        {isExploding && (
          <>
            {[...Array(40)].map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              const distance = 150 + Math.random() * 100;
              const tx = Math.cos(angle) * distance;
              const ty = Math.sin(angle) * distance;
              const delay = Math.random() * 0.3;
              const colors = [
                "#FF4136",
                "#FF851B",
                "#FFDC00",
                "#FFD700",
                "#FFA500",
              ];
              const color = colors[Math.floor(Math.random() * colors.length)];
              const sizes = ["small-spark", "medium-spark", "large-spark"];
              const sparkSize = sizes[Math.floor(Math.random() * sizes.length)];

              return (
                <div
                  key={i}
                  className={`spark ${sparkSize}`}
                  style={
                    {
                      "--tx": `${tx}px`,
                      "--ty": `${ty}px`,
                      backgroundColor: color,
                      left: "50%",
                      top: "50%",
                      animationDelay: `${delay}s`,
                    } as any
                  }
                />
              );
            })}
          </>
        )}

        <div className="flex justify-between items-center mb-3">
          <div className="h-1 bg-gray-200 rounded-full w-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / ticket.timeToProcess) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 ml-2">{timeLeft}s</span>
        </div>
        <p className="text-gray-700 text-sm line-clamp-2 min-h-10">{ticket.description}</p>
        <div className="mt-3 text-gray-400 text-xs">
          #{ticket.id}
          <span
            className={`${getPriorityColor()} text-xs rounded-sm px-4 py-1 ml-2 font-medium text-white`}
          >
            {ticket.priority}
          </span>
        </div>
      </div>
    </div>
  );
}
