'use client'
import { createContext, useContext, useState } from 'react';

export interface EventData {
  name: string;
  dates: Date[];
}

const EventContext = createContext<{
  eventData: EventData | null;
  setEventData: (data: EventData) => void;
}>({
  eventData: null,
  setEventData: () => {},
});

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [eventData, setEventData] = useState<EventData | null>(null);

  return (
    <EventContext.Provider value={{ eventData, setEventData }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);