'use client';
import React, { useState } from 'react';

interface EventData {
  name: string;
  dates: Date[];
}

interface EventCreatorProps {
  onEventCreated: (eventData: EventData) => void;
}

const EventCreator: React.FC<EventCreatorProps> = ({ onEventCreated }) => {
  const [eventName, setEventName] = useState('');
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month/year info
  const getCurrentMonthInfo = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    // Get first day of month and how many days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    return { year, month, monthName, daysInMonth, startingDayOfWeek };
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Handle date selection
  const toggleDate = (day: number) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    const newSelected = new Set(selectedDates);

    if (newSelected.has(dateKey)) {
      newSelected.delete(dateKey);
    } else {
      newSelected.add(dateKey);
    }
    setSelectedDates(newSelected);
  };

  // Check if date is selected
  const isDateSelected = (day: number) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    return selectedDates.has(dateKey);
  };

  // Check if date is in the past
  const isDateInPast = (day: number) => {
    const today = new Date();
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Format selected dates for display
  const getSelectedDatesText = () => {
    if (selectedDates.size === 0) return 'No dates selected';

    const dates = Array.from(selectedDates)
      .map((dateKey: string) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month, day);
        return {
          date,
          formatted: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return dates.map((d) => d.formatted).join(', ');
  };

  // Handle form submission
  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      alert('Please enter an event name');
      return;
    }

    if (selectedDates.size === 0) {
      alert('Please select at least one date');
      return;
    }

    // Convert selected dates to a more usable format
    const eventDates = Array.from(selectedDates)
      .map((dateKey: string) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month, day);
      })
      .sort((a: Date, b: Date) => a.getTime() - b.getTime());

    const eventData = {
      name: eventName,
      dates: eventDates,
    };

    onEventCreated(eventData);
  };

  const { monthName, daysInMonth, startingDayOfWeek } = getCurrentMonthInfo();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create calendar grid
  const calendarDays = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 pt-24">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800 rounded-lg p-8 shadow-2xl">
          {/* Event Name Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Calendar */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Dates
            </label>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                ←
              </button>
              <h3 className="text-lg font-medium text-white">{monthName}</h3>
              <button
                onClick={goToNextMonth}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                →
              </button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-10"></div>;
                }

                const isSelected = isDateSelected(day);
                const isPast = isDateInPast(day);
                const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;

                return (
                  <button
                    key={dateKey}
                    onClick={() => !isPast && toggleDate(day)}
                    disabled={isPast}
                    className={`h-10 rounded-md text-sm font-medium transition-all duration-200 ${isPast
                      ? 'text-gray-600 cursor-not-allowed'
                      : isSelected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected dates display */}
          <div className="mb-8 p-4 bg-gray-700 rounded-md">
            <p className="text-sm text-gray-300 mb-2">Selected dates:</p>
            <p className="text-sm text-emerald-400">{getSelectedDatesText()}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCreateEvent}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
            >
              Create Event
            </button>
            <button
              onClick={() => {
                setEventName('');
                setSelectedDates(new Set());
              }}
              className="px-6 py-3 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreator;
