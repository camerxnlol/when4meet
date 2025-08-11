'use client';
import React, { useState } from 'react';
import { EventTimeGrid } from './EventTimeGrid';
import { Pagination } from './Pagination';
import { Sidebar } from './Sidebar';

interface EventData {
  name: string;
  dates: Date[];
}

interface EventWhen4meetProps {
  eventData: EventData;
}

const EventWhen4meet: React.FC<EventWhen4meetProps> = ({ eventData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const daysPerPage = 7;

  const totalPages = Math.ceil(eventData.dates.length / daysPerPage);
  const currentDates = eventData.dates.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  // State to track availability - using a Set for selected 30-minute blocks
  const [availabilityMap, setAvailabilityMap] = useState<Map<string, Set<string>>>(new Map());
  const [ifNeededMap, setIfNeededMap] = useState<Map<string, Set<string>>>(new Map());
  const [members, setMembers] = useState<Set<string>>(new Set());

  // Sidebar member display on hover
  const [hoverSlot, setHoverSlot] = useState("");

  const handleAddMember = async () => {
    const kerbInput = document.getElementById("kerbInput") as HTMLInputElement;
    const kerb = kerbInput.value;

    const res = await fetch(`../../api/load-availability?username=${kerb}`);
    const data = await res.json();

    let memberAvailability: string[], memberIfNeeded: string[];
    if (data.length != 0) {
      memberAvailability = JSON.parse(data[0].available);
      memberIfNeeded = JSON.parse(data[0].if_needed);

    } else {
      memberAvailability = []
      memberIfNeeded = []
    }

    // update availability map
    const updatedAvailabilityMap = new Map(availabilityMap);
    memberAvailability.forEach((key) => {
      const existingSet = updatedAvailabilityMap.get(key) ?? new Set<string>();
      existingSet.add(kerb);
      updatedAvailabilityMap.set(key, existingSet);
    });
    setAvailabilityMap(updatedAvailabilityMap);

    // update if needed map
    const updatedIfNeededMap = new Map(ifNeededMap);
    memberIfNeeded.forEach((key) => {
      const existingSet = updatedIfNeededMap.get(key) ?? new Set<string>();
      existingSet.add(kerb);
      updatedIfNeededMap.set(key, existingSet);
    });
    setIfNeededMap(updatedIfNeededMap);

    // update member set
    setMembers(new Set([...members, kerb]));
  }

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
            <EventTimeGrid
              currentDates={currentDates}
              availabilityMap={availabilityMap}
              setAvailabilityMap={setAvailabilityMap}
              ifNeededMap={ifNeededMap}
              setIfNeededMap={setIfNeededMap}
              members={members}
              setMembers={setMembers}
              hoverSlot={hoverSlot}
              setHoverSlot={setHoverSlot}
            />
          </div>

          {/* Right sidebar */}
          <Sidebar
            eventName={eventData.name}
            handleAddMember={handleAddMember}
            currentPage={currentPage}
            totalPages={totalPages}
            hoverSlot={hoverSlot}
          />
        </div>
      </div>
    </div>
  );
};

export default EventWhen4meet;
