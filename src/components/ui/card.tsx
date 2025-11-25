"use client";

import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white border rounded-xl p-4 shadow-sm transition active:scale-[0.98]",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
