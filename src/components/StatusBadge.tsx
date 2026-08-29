import React from 'react';

export type StatusVariant = 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  variant: StatusVariant;
  text: string;
}

export function StatusBadge({ variant, text }: StatusBadgeProps) {
  return (
    <span className={`badge ${variant}`}>
      <span className="d" />
      {text}
    </span>
  );
}
