import React, { useState } from 'react';

interface TimeGridProps {
  currentDates: Date[];
  selectedType: AvailabilityType;
  availability: Set<string>;
  setAvailability: (type: Set<string>) => void;
  ifNeeded: Set<string>;
  setIfNeeded: (type: Set<string>) => void;
}

type AvailabilityType = 'available' | 'if-needed';

export const TimeGrid: React.FC<TimeGridProps> = ({
  currentDates,
  selectedType,
  availability,
  setAvailability,
  ifNeeded,
  setIfNeeded,
}) => {
  // Generate time slots for 30-minute time intervals

  // Generate time slots (9 AM to 12 AM in 30-minute intervals)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeStr = time
          .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
          .replace(' ', '');
        slots.push(timeStr);
      }
    }
    return slots;
  };

  // Format date for display
  const formatColumnDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const timeSlots = generateTimeSlots();

  // State to track availability - using a Set for selected 30-minute blocks
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

  // Create unique key for each 30-minute block
  const createSlotKey = (date: Date, time: string, half: string): string =>
    `${date.toISOString()}-${time}-${half}`;

  // Handle mouse events for selecting/deselecting time slots
  const handleMouseDown = (date: Date, time: string, half: string) => {
    if (half === 'both') {
      // Handle full 30-minute block
      const firstKey = createSlotKey(date, time, 'first');
      const secondKey = createSlotKey(date, time, 'second');
      const currentSet = selectedType === 'available' ? availability : ifNeeded;
      const bothSelected =
        currentSet.has(firstKey) && currentSet.has(secondKey);

      setIsDragging(true);
      setDragMode(bothSelected ? 'deselect' : 'select');

      const newSet = new Set(currentSet);
      if (bothSelected) {
        newSet.delete(firstKey);
        newSet.delete(secondKey);
      } else {
        newSet.add(firstKey);
        newSet.add(secondKey);
      }

      if (selectedType === 'available') {
        setAvailability(newSet);
      } else {
        setIfNeeded(newSet);
      }
    } else {
      // Original logic for individual 30-minute blocks
      const key = createSlotKey(date, time, half);
      const currentSet = selectedType === 'available' ? availability : ifNeeded;
      const isSelected = currentSet.has(key);

      setIsDragging(true);
      setDragMode(isSelected ? 'deselect' : 'select');

      const newSet = new Set(currentSet);
      if (isSelected) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }

      if (selectedType === 'available') {
        setAvailability(newSet);
      } else {
        setIfNeeded(newSet);
      }
    }
  };

  const handleMouseEnter = (date: Date, time: string, half: string) => {
    if (!isDragging) return;

    if (half === 'both') {
      // Handle full 30-minute block
      const firstKey = createSlotKey(date, time, 'first');
      const secondKey = createSlotKey(date, time, 'second');
      const currentSet = selectedType === 'available' ? availability : ifNeeded;
      const newSet = new Set(currentSet);

      if (dragMode === 'select') {
        newSet.add(firstKey);
        newSet.add(secondKey);
      } else {
        newSet.delete(firstKey);
        newSet.delete(secondKey);
      }

      if (selectedType === 'available') {
        setAvailability(newSet);
      } else {
        setIfNeeded(newSet);
      }
    } else {
      // Original logic for individual 30-minute blocks
      const key = createSlotKey(date, time, half);
      const currentSet = selectedType === 'available' ? availability : ifNeeded;
      const newSet = new Set(currentSet);

      if (dragMode === 'select') {
        newSet.add(key);
      } else {
        newSet.delete(key);
      }

      if (selectedType === 'available') {
        setAvailability(newSet);
      } else {
        setIfNeeded(newSet);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  // Prevent text selection while dragging
  React.useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.userSelect = '';
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.userSelect = '';
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Check if a 30-minute block is selected
  const isBlockSelected = (
    date: Date,
    time: string,
    half: string
  ): { available: boolean; ifNeeded: boolean } => {
    const key = createSlotKey(date, time, half);
    return {
      available: availability.has(key),
      ifNeeded: ifNeeded.has(key),
    };
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Header with dates */}
        <div className="flex border-b border-gray-600">
          <div className="w-16 flex-shrink-0 border-r border-gray-600"></div>{' '}
          {/* Empty corner */}
          {currentDates.map((date) => (
            <div
              key={date.toISOString()}
              className="flex-1 min-w-[80px] text-center font-medium text-gray-300 py-3 text-sm border-r border-gray-600"
            >
              {formatColumnDate(date)}
            </div>
          ))}
        </div>

        {/* Time slots grid */}
        {timeSlots.map((time, timeIndex) => (
          <div
            key={`time-${timeIndex}-${time}`}
            className="flex border-b border-gray-700"
          >
            {/* Time label */}
            <div className="w-16 flex-shrink-0 text-right pr-3 py-1 text-xs text-gray-400 font-mono flex items-center justify-end border-r border-gray-600">
              {time}
            </div>

            {/* Availability cells for each date */}
            {currentDates.map((date) => {
              const firstHalf = isBlockSelected(date, time, 'first');
              const secondHalf = isBlockSelected(date, time, 'second');

              return (
                <div
                  key={`${date.toISOString()}-${timeIndex}-${time}`}
                  className="flex-1 min-w-[80px] h-6 border-r border-gray-600"
                >
                  {/* Single column that handles both 30-minute blocks */}
                  <div
                    className={`w-full h-full cursor-pointer transition-all duration-150 ${
                      firstHalf.available && secondHalf.available
                        ? 'bg-emerald-500 hover:bg-emerald-400'
                        : firstHalf.ifNeeded && secondHalf.ifNeeded
                          ? 'bg-amber-500 hover:bg-amber-400'
                          : firstHalf.available || secondHalf.available
                            ? 'bg-emerald-400 hover:bg-emerald-300'
                            : firstHalf.ifNeeded || secondHalf.ifNeeded
                              ? 'bg-amber-400 hover:bg-amber-300'
                              : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onMouseDown={() => handleMouseDown(date, time, 'both')}
                    onMouseEnter={() => handleMouseEnter(date, time, 'both')}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
