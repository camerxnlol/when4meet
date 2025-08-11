'use client';
import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface EventCreatorProps {
}

const EventCreator: React.FC<EventCreatorProps> = () => {
  const [eventName, setEventName] = useState('');

  // Handle form submission
  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      alert('Please enter an event name');
      return;
    }

    setEventName(eventName);
    // onEventCreated(eventData);
  };

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
            <Button
              onPress={handleCreateEvent}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
            >
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreator;
