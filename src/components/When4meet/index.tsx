'use client';
import React, { useState } from 'react';
import { TimeGrid } from './TimeGrid';
import { Pagination } from './Pagination';
import { Sidebar } from './Sidebar';
import { Availability, AvailabilitySelection } from '@/lib/availability';

interface EventData {
  name: string;
  dates: Date[];
}

interface When4meetProps {
  eventData: EventData;
}

const When4meet: React.FC<When4meetProps> = ({ eventData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const daysPerPage = 7;
  const [selectedType, setSelectedType] = useState<AvailabilitySelection>(
    Availability.Available
  );

  const totalPages = Math.ceil(eventData.dates.length / daysPerPage);
  const currentDates = eventData.dates.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  // State to track availability - using a Set for selected 30-minute blocks
  const [availability, setAvailability] = useState<Set<string>>(new Set());
  const [ifNeeded, setIfNeeded] = useState<Set<string>>(new Set());

  const handleLoad = async () => {
    const kerbInput = document.getElementById("kerbInput") as HTMLInputElement;
    const kerb = kerbInput.value;

    if (kerb.length == 0) {
      alert(`Please Enter Your Kerb`);
      return;
    }

    const res = await fetch(`../../api/load-availability?username=${kerb}`);
    const data = await res.json();

    if (data.length != 0) {
      const newAvailability: string[] = JSON.parse(data[0].available);
      const newIfNeeded: string[] = JSON.parse(data[0].if_needed);
      setAvailability(new Set<string>(newAvailability));
      setIfNeeded(new Set<string>(newIfNeeded));
    } else {
      alert(`No Previous Data for ${kerb}`);
    }
  }

  const handleSubmit = async () => {
    const availabilityArray = Array.from(availability);
    console.log(availabilityArray);
    const ifNeededArray = Array.from(ifNeeded);

    const kerbInput = document.getElementById("kerbInput") as HTMLInputElement;
    const kerb = kerbInput.value;

    const nameInput = document.getElementById("nameInput") as HTMLInputElement;
    const name = nameInput.value;
    
    if (kerb.length == 0) {
      alert(`Please Enter Your Kerb`);
      return;
    } else if (name.length == 0) {
      alert(`Please Enter Your Name`);
    }

    const jsonAvailability = JSON.stringify(availabilityArray);
    const jsonIfNeeded = JSON.stringify(ifNeededArray);

    const res = await fetch('../../api/upsert-availability', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: kerb,
        name: name,
        available: jsonAvailability,
        if_needed: jsonIfNeeded,
      })
    });

    const result = await res.json();
    if (res.ok) {
      console.log('Upsert success:', result.data);
    } else {
      console.error('Upsert error:', result.error);
    }
  };

  const clearAll = () => {
    setAvailability(new Set());
    setIfNeeded(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          <div className="flex-1">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
            <TimeGrid
              currentDates={currentDates}
              selectedType={selectedType}
              availability={availability}
              setAvailability={setAvailability}
              ifNeeded={ifNeeded}
              setIfNeeded={setIfNeeded}
            />
            {/* Footer info */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                {availability.size} available blocks, {ifNeeded.size} if-needed
                blocks
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <Sidebar
            eventName={eventData.name}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            handleSubmit={handleSubmit}
            handleLoad={handleLoad}
            clearAll={clearAll}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default When4meet;
