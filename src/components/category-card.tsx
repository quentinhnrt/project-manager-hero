"use client";

import { Category } from "@/lib/tickets";
import React from "react";

interface CategoryCardProps {
  category: Category;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function CategoryCard({
  category,
  onDragOver,
  onDrop,
}: CategoryCardProps) {
  const getBackgroundColor = () => {
    switch (category) {
      case "support":
        return "bg-mint-100 border-mint-200";
      case "feature":
        return "bg-lime-100 border-lime-200";
      case "technical":
        return "bg-orange-100 border-orange-200";
      case "bug":
        return "bg-red-100 border-red-200";
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} p-4 lg:p-6 rounded-lg border-2 text-center text-2xl font-bold min-h-24 w-full flex items-center justify-center transition-colors`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {category}
    </div>
  );
}
