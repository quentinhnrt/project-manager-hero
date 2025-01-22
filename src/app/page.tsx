"use client";

import React, { useState, useEffect } from "react";
import Ticket from "@/components/ticket";
import { CategoryCard } from "@/components/category-card";

export type Category = "bug" | "feature" | "technical" | "support";
export type Priority = "minor" | "medium" | "major" | "critical";

export type TicketType = {
  id: number;
  description: string;
  category: Category;
  timeToProcess: number;
  priority: Priority;
};

export interface LostTicket extends TicketType {
  category: Category;
}

const INITIAL_TICKETS: TicketType[] = [
  {
    id: 1,
    description: "L'application crash au démarrage",
    category: "bug",
    timeToProcess: 10,
    priority: "critical",
  },
  {
    id: 2,
    description: "Ajouter un mode sombre",
    category: "feature",
    timeToProcess: 20,
    priority: "minor",
  },
  {
    id: 3,
    description: "Optimiser les requêtes API",
    category: "technical",
    timeToProcess: 30,
    priority: "major",
  },
];

export default function Home() {
  const [activeTickets, setActiveTickets] =
    useState<TicketType[]>(INITIAL_TICKETS);
  const [lostTickets, setLostTickets] = useState<LostTicket[]>([]);

  const handleDragStart = (e: React.DragEvent, category: Category) => {
    e.dataTransfer.setData("category", category);
    const ticketId = parseInt(e.currentTarget.id);
    e.dataTransfer.setData("ticketId", ticketId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategory: Category) => {
    e.preventDefault();
    const draggedCategory = e.dataTransfer.getData("category") as Category;
    const ticketId = parseInt(e.dataTransfer.getData("ticketId"));

    const ticket = activeTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    if (draggedCategory === targetCategory) {
      setActiveTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } else {
      setLostTickets((prev) => [...prev, ticket]);
      setActiveTickets((prev) => prev.filter((t) => t.id !== ticketId));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTickets((prev) => {
        const newTickets = [...prev];
        const ticketToRemove = newTickets[0];
        if (ticketToRemove) {
          setLostTickets((prev) => [...prev, ticketToRemove]);
        }
        return newTickets.slice(1);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <div className="text-center mb-8 w-full">
        <p className="text-red-500">Tickets perdus: {lostTickets.length}</p>
      </div>

      <div className="flex flex-col gap-4 items-center mb-8 w-full max-w-md">
        {activeTickets.map((ticket) => (
          <Ticket key={ticket.id} {...ticket} onDragStart={handleDragStart} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {["support", "feature", "technical", "bug"].map((category) => (
          <CategoryCard
            key={category}
            category={category as Category}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category as Category)}
          />
        ))}
      </div>
    </main>
  );
}
