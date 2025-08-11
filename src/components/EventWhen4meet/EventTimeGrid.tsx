import React from 'react';

interface EventTimeGridProps {
  currentDates: Date[];
  availabilityMap: Map<string, Set<string>>; // ('timeslot key' -> {kerbs})
  setAvailabilityMap: (type: Map<string, Set<string>>) => void;
  ifNeededMap: Map<string, Set<string>>; // ('timeslot key' -> {kerbs})
  setIfNeededMap: (type: Map<string, Set<string>>) => void;
  members: Set<string>;
  setMembers: (type: Set<string>) => void;
  hoverSlot: string;
  setHoverSlot: (type: string) => void;
}

export const EventTimeGrid: React.FC<EventTimeGridProps> = ({
  currentDates,
  availabilityMap,
  ifNeededMap,
  members,
}) => {
  
  // Generate time slots for 30-minute time intervals
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

  // Create unique key for each 30-minute block
  const createSlotKey = (date: Date, time: string): string => {
    // Parse time string (e.g. "10:30AM") and combine with date
    const [hourStr, minuteStr] = time.match(/\d+/g) ?? [];
    if (hourStr == undefined) {
      return "something wrong";
    }
    const isPM = time.toUpperCase().includes("PM");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const combined = new Date(date);
    combined.setHours(hour, minute, 0, 0); // clear seconds & ms

    return combined.toISOString(); // unique and consistent
  };

  const getCellOpacity = (
    blockCount: { available: number; ifNeeded: number },
    numMembers: number,
  ) => {

    if (numMembers == 0) {
      return 0;
    } else {
      return blockCount.available/numMembers;
    }
  };

  // Check if a 30-minute block is selected
  const getBlockCount = (
    date: Date,
    time: string,
  ): { available: number; ifNeeded: number } => {
    const key = createSlotKey(date, time);
    const availability = availabilityMap.get(key);
    const ifNeeded = ifNeededMap.get(key);
    var availabilityCount, ifNeededCount;
    if (availability) {
      availabilityCount = availability.size;
    } else {
      availabilityCount = 0;
    }
    if (ifNeeded) {
      ifNeededCount = ifNeeded.size;
    } else {
      ifNeededCount = 0;
    }

    return {
      available: availabilityCount,
      ifNeeded: ifNeededCount,
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Header with dates */}
        <div className="flex border-b border-gray-600">
          <div className="w-16 shrink-0 border-r border-gray-600"></div>{' '}
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
            <div className="w-16 shrink-0 text-right pr-3 py-1 text-xs text-gray-400 font-mono flex items-center justify-end border-r border-gray-600">
              {time}
            </div>

            {/* Availability cells for each date */}
            {currentDates.map((date) => {
              // const selection = isBlockSelected(date, time);

              const blockCount = getBlockCount(date, time);
              const opacity = getCellOpacity(blockCount, members.size);
              const blockStyle = { opacity: opacity };

              return (
                <div
                  key={`${date.toISOString()}-${timeIndex}-${time}`}
                  className="flex-1 min-w-[80px] h-6 border-r border-gray-600"
                >
                  <div
                    className={`w-full h-full cursor-pointer transition-all duration-150 bg-emerald-500`}
                    style={blockStyle}
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
