import React from 'react';

export type StatCardVariant = 'blue' | 'ok' | 'warn' | 'danger' | 'gold';

interface StatCardProps {
  variant: StatCardVariant;
  label: string;
  number: number | string;
  icon: string;
}

export function StatCard({ variant, label, number, icon }: StatCardProps) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="top">
        <span className="lab">{label}</span>
        <span className="chip">{icon}</span>
      </div>
      <div className="num">{number}</div>
    </div>
  );
}
