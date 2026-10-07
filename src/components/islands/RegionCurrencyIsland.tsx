'use client';

import React, { useState } from 'react';

const REGIONS = [
  { code: 'US', label: 'United States ($ USD)' },
  { code: 'CA', label: 'Canada (CA$ CAD)' },
  { code: 'UK', label: 'United Kingdom (£ GBP)' },
  { code: 'EU', label: 'Germany (€ EUR)' },
];

export function RegionCurrencyIsland() {
  const [selected, setSelected] = useState('US');

  return (
    <div className="flex items-center text-xs text-gray-300">
      <span className="mr-1">🌐 Ship to:</span>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="bg-transparent text-white border-b border-gray-500 text-xs py-0.5 focus:outline-none cursor-pointer"
      >
        {REGIONS.map((r) => (
          <option key={r.code} value={r.code} className="bg-gray-800 text-white">
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
