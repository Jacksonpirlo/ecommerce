// src/components/Search.tsx
'use client';
import React from 'react';

export default function Search() {
  const [q, setQ] = React.useState('');
  return (
    <div>
      <label htmlFor="q">Buscar</label>
      <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Escribe..." />
      <p data-testid="mirror">{q}</p>
    </div>
  );
}