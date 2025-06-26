import { Availability, AvailabilitySelection } from '@/lib/availability';
import React from 'react';

interface SidebarProps {
  eventName: string;
  selectedType: AvailabilitySelection;
  setSelectedType: (type: AvailabilitySelection) => void;
  handleSubmit: () => void;
  clearAll: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  eventName,
  selectedType,
  setSelectedType,
  handleSubmit,
  clearAll,
}) => (
  <div className="w-64 flex-shrink-0">
    {/* Event name */}
    <div className="mb-8">
      <h1 className="text-2xl font-light tracking-wide text-white mb-2">
        {eventName}
      </h1>
      <p className="text-gray-400 text-sm whitespace-nowrap">
        Select availability • Click and drag
      </p>
    </div>

    {/* Availability Type Toggle */}
    <div className="mb-8">
      <div className="inline-flex rounded-md bg-gray-800 p-1 w-full">
        <button
          onClick={() => setSelectedType(Availability.Available)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selectedType === Availability.Available
              ? 'bg-emerald-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setSelectedType(Availability.IfNeeded)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selectedType === Availability.IfNeeded
              ? 'bg-amber-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          If Needed
        </button>
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex flex-col gap-3">
      <button
        onClick={handleSubmit}
        className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all duration-200 text-sm font-medium"
      >
        Save
      </button>
      <button
        onClick={clearAll}
        className="w-full px-6 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
      >
        Clear
      </button>
    </div>
  </div>
);
