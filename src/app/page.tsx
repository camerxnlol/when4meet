'use client';
import React from 'react';
import { useState } from 'react';
import EventCreator from '@/components/EventCreator';
import When4meet from '@/components/When4meet';

interface EventData {
  name: string;
  dates: Date[];
}

export default function Home() {
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);

  const handleEventCreated = (eventData: EventData) => {
    setCurrentEvent(eventData);
    console.log('Event created:', eventData);
  };

  const handleBackToEventCreation = () => {
    setCurrentEvent(null);
  };

  if (!currentEvent) {
    return <EventCreator onEventCreated={handleEventCreated} />;
  }

  return (
    <div>
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={handleBackToEventCreation}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
        >
          ← Back to Event Creation
        </button>
      </div>
      <When4meet eventData={currentEvent} />
    </div>
  );
}
