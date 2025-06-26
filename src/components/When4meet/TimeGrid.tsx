import { Availability, AvailabilitySelection } from '@/lib/availability';
import React, { useState, useEffect } from 'react';

interface TimeGridProps {
  currentDates: Date[];
  selectedType: AvailabilitySelection;
  availability: Set<string>;
  setAvailability: (type: Set<string>) => void;
  ifNeeded: Set<string>;
  setIfNeeded: (type: Set<string>) => void;
}

interface DragState {
  startDate: Date | null;
  startTime: string | null;
  currentDate: Date | null;
  currentTime: string | null;
  mode: 'select' | 'deselect' | null;
}

export const TimeGrid: React.FC<TimeGridProps> = ({
  currentDates,
  selectedType,
  availability,
  setAvailability,
  ifNeeded,
  setIfNeeded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    startDate: null,
    startTime: null,
    currentDate: null,
    currentTime: null,
    mode: null,
  });
  const [previewKeys, setPreviewKeys] = useState<Set<string>>(new Set());

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

  const getTimeIndex = (time: string) => timeSlots.indexOf(time);
  const getDateIndex = (date: Date) =>
    currentDates.findIndex((d) => d.toISOString() === date.toISOString());

  const getRectangleKeys = (
    startDate: Date,
    startTime: string,
    endDate: Date,
    endTime: string
  ) => {
    const startDateIdx = getDateIndex(startDate);
    const endDateIdx = getDateIndex(endDate);
    const startTimeIdx = getTimeIndex(startTime);
    const endTimeIdx = getTimeIndex(endTime);

    const minDateIdx = Math.min(startDateIdx, endDateIdx);
    const maxDateIdx = Math.max(startDateIdx, endDateIdx);
    const minTimeIdx = Math.min(startTimeIdx, endTimeIdx);
    const maxTimeIdx = Math.max(startTimeIdx, endTimeIdx);

    const keys: string[] = [];
    for (let dateIdx = minDateIdx; dateIdx <= maxDateIdx; dateIdx++) {
      for (let timeIdx = minTimeIdx; timeIdx <= maxTimeIdx; timeIdx++) {
        const date = currentDates[dateIdx];
        const time = timeSlots[timeIdx];
        keys.push(createSlotKey(date, time));
      }
    }
    return keys;
  };

  // Create unique key for each 30-minute block
  const createSlotKey = (date: Date, time: string): string =>
    `${date.toISOString()}-${time}`;

  const updateAvailabilitySet = (
    keys: string[],
    action: 'select' | 'deselect'
  ) => {
    // Clear keys from both sets when selecting
    if (action === 'select') {
      const newAvailability = new Set(availability);
      const newIfNeeded = new Set(ifNeeded);
      keys.forEach((key) => {
        newAvailability.delete(key);
        newIfNeeded.delete(key);
      });

      // Add to the appropriate set
      keys.forEach((key) => {
        if (selectedType === Availability.Available) {
          newAvailability.add(key);
        } else {
          newIfNeeded.add(key);
        }
      });

      setAvailability(newAvailability);
      setIfNeeded(newIfNeeded);
    } else {
      // For deselect, remove from both sets
      const newAvail = new Set(availability);
      keys.forEach((key) => newAvail.delete(key));
      setAvailability(newAvail);

      const newIfNeeded = new Set(ifNeeded);
      keys.forEach((key) => newIfNeeded.delete(key));
      setIfNeeded(newIfNeeded);
    }
  };

  const handleMouseDown = (date: Date, time: string) => {
    const currentSet =
      selectedType === Availability.Available ? availability : ifNeeded;
    const key = createSlotKey(date, time);
    const isSelected = currentSet.has(key);

    setIsDragging(true);
    setDragState({
      startDate: date,
      startTime: time,
      currentDate: date,
      currentTime: time,
      mode: isSelected ? 'deselect' : 'select',
    });
  };

  const handleMouseEnter = (date: Date, time: string) => {
    if (!dragState.startDate || !dragState.startTime || !dragState.mode) return;

    setDragState((prev) => ({
      ...prev,
      currentDate: date,
      currentTime: time,
    }));

    const keys = getRectangleKeys(
      dragState.startDate,
      dragState.startTime,
      date,
      time
    );
    setPreviewKeys(new Set(keys));
  };

  const handleMouseUp = () => {
    if (dragState.startDate && dragState.currentDate && dragState.mode) {
      const keys = getRectangleKeys(
        dragState.startDate,
        dragState.startTime!,
        dragState.currentDate,
        dragState.currentTime!
      );
      updateAvailabilitySet(keys, dragState.mode);
    }

    setIsDragging(false);
    setDragState({
      startDate: null,
      startTime: null,
      currentDate: null,
      currentTime: null,
      mode: null,
    });
    setPreviewKeys(new Set());
  };

  // In your GridCells component, add a preview class:
  const isInPreview = (date: Date, time: string) =>
    previewKeys.has(createSlotKey(date, time));
  // Don't forget to add the mouseup event listener
  useEffect(() => {
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
  });

  const getCellColor = (
    selection: { available: boolean; ifNeeded: boolean },
    isPreview: boolean,
    selectedType: Availability,
    dragMode: 'select' | 'deselect' | null
  ) => {
    if (isPreview) {
      if (dragMode === 'deselect') {
        return 'bg-gray-700 opacity-75';
      }
      if (selectedType === Availability.Available) {
        return 'bg-emerald-500 opacity-75';
      }
      return 'bg-amber-500 opacity-75';
    }
    if (selection.available) {
      return 'bg-emerald-500 hover:bg-emerald-400';
    }
    if (selection.ifNeeded) {
      return 'bg-amber-500 hover:bg-amber-400';
    }
    return 'bg-gray-800 hover:bg-gray-700';
  };

  // Check if a 30-minute block is selected
  const isBlockSelected = (
    date: Date,
    time: string,
  ): { available: boolean; ifNeeded: boolean } => {
    const key = createSlotKey(date, time);
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
              const selection = isBlockSelected(date, time);

              return (
                <div
                  key={`${date.toISOString()}-${timeIndex}-${time}`}
                  className="flex-1 min-w-[80px] h-6 border-r border-gray-600"
                >
                  <div
                    className={`w-full h-full cursor-pointer transition-all duration-150 ${getCellColor(
                      selection,
                      isInPreview(date, time),
                      selectedType,
                      dragState.mode
                    )}`}
                    onMouseDown={() => handleMouseDown(date, time)}
                    onMouseEnter={() => handleMouseEnter(date, time)}
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
