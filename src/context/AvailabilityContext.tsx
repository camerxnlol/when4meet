'use client'
import { createContext, useContext, useState } from 'react';

export interface AvailabilityData {
  kerb: string;
  availabilityArray: string[];
  ifNeededArray: string[];
}

const AvailabilityContext = createContext<{
  availabilityData: AvailabilityData | null;
  setAvailabilityData: (data: AvailabilityData) => void;
}>({
  availabilityData: null,
  setAvailabilityData: () => {},
});

export const AvailabilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);

  return (
    <AvailabilityContext.Provider value={{ availabilityData, setAvailabilityData }}>
      {children}
    </AvailabilityContext.Provider>
  );
};

export const useAvailability = () => useContext(AvailabilityContext);