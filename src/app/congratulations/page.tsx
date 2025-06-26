'use client';

import { useState } from 'react';
import { dbClient } from '@/lib/db';

export default function CongratulationsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const buttons = [
    'getUsers',
    'getEvents',
    'getEventUsers',
    'getWeeklyAvailabilities',
    'getUserAvailability',
  ];

  const runQuery = async (type: string) => {
    setLoading(type);

    try {
      switch (type) {
        case 'getUsers':
          console.log(`[${type}]`, await dbClient.getAllUserNames());
          break;
      }
    } catch (err) {
      console.error(`[❌ ${type}]`, err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">super secret test panel oooo</h1>
      <div className="space-y-3">
        {buttons.map((key) => (
          <button
            key={key}
            onClick={() => runQuery(key)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading !== null}
          >
            {loading === key ? 'Loading...' : key}
          </button>
        ))}
      </div>
    </main>
  );
}
