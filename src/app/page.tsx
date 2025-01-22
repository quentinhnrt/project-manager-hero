"use client";

import { CategoryCard } from "@/components/category-card";
import TicketComponent from "@/components/ticket";
import { Category, Ticket } from "@/lib/tickets";
import { useTicketsContext } from "@/providers/TicketsProviders";
import React from "react";

export default function Home() {
  const {
    pendingTickets,
    expiredTickets,
    processedTickets,
    lostTickets,
    setTicketToLost,
    setTicketToProcessed,
  } = useTicketsContext();

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

    const ticket = pendingTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    if (draggedCategory === targetCategory) {
      setTicketToProcessed(ticket);
    } else {
      setTicketToLost(ticket, targetCategory);
    }
  };

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <div className="text-center mb-8 w-full">
        <p className="text-red-500">Tickets perdus: {expiredTickets.length}</p>
        <p className="text-green-500">Tickets echec: {lostTickets.length}</p>
        <p className="text-green-500">
          Tickets trouvé: {processedTickets.length}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-4 gap-4 items-center mb-8 w-full">
        {pendingTickets.map((ticket: Ticket) => (
          <TicketComponent
            key={ticket.id}
            {...ticket}
            onDragStart={handleDragStart}
          />
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
