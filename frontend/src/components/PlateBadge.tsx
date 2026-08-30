import React from 'react';

interface PlateBadgeProps {
  plate: string;
}

export function PlateBadge({ plate }: PlateBadgeProps) {
  const cleanPlate = plate.replace('-', '').toUpperCase();
  return (
    <span className="plate">
      <span className="flag">BR</span>
      <span className="num">{cleanPlate}</span>
    </span>
  );
}
