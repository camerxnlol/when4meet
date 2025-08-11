'use client';
import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

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

    

    // onEventCreated(eventData);
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
      <div className="max-w-xl w-full">
        <div className="bg-gray-800 rounded-lg p-6 shadow-2xl">
          {/* Event Name Input */}
          <div className="mb-8 w-full flex-wrap bg-gray-700 rounded-md gap-4">
            <Input
              isClearable
              isRequired
              label="Event Name"
              placeholder="Enter your event name"
              type="string"
              id="eventNameInput"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCreateEvent}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreator;
