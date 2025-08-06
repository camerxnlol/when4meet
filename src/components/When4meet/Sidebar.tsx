import { Availability, AvailabilitySelection } from '@/lib/availability';
import React from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface SidebarProps {
  eventName: string;
  selectedType: AvailabilitySelection;
  setSelectedType: (type: AvailabilitySelection) => void;
  handleLoad: () => void;
  handleSubmit: () => void;
  clearAll: () => void;
  currentPage?: number;
  totalPages?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  eventName,
  selectedType,
  setSelectedType,
  handleLoad,
  handleSubmit,
  clearAll,
  currentPage = 0,
  totalPages = 1,
}) => {
  // Calculate which week is being shown
  const currentWeekNumber = currentPage + 1;
  const totalWeeks = totalPages;

  // Get the date range for the current week
  const getWeekRange = () => {
    if (currentPage === 0) {
      return "Current Week";
    } else if (currentPage === 1) {
      return "Next Week";
    } else {
      return `Week ${currentWeekNumber}`;
    }
  };

  return (
    <div className="w-64 shrink-0">
      {/* Event name */}
      <div className="mb-8 pt-10">
        <h1 className="text-2xl font-semibold tracking-wide text-white mb-2">
          {eventName}
        </h1>
        <p className="text-gray-400 text-sm whitespace-nowrap">
          {getWeekRange()} • Click time slots to mark your availability
        </p>
        {totalWeeks > 1 && (
          <p className="text-gray-500 text-xs mt-1">
            Week {currentWeekNumber} of {totalWeeks}
          </p>
        )}
      </div>

      {/* Kerb + Name fields */}
      <div className="flex flex-col gap-3">
        <div className="w-full flex-wrap bg-gray-700 rounded-md gap-4 transition-all duration-200 text-sm font-medium">
          <Input isClearable
                 isRequired
                 label="Kerb"
                 placeholder="Enter your Kerb"
                 type="string"
                 id="kerbInput"/>
        </div>
        <div className="w-full flex-wrap bg-gray-700 rounded-md gap-4 transition-all duration-200 text-sm font-medium">
          <Input isClearable
                 isRequired
                 label="Name"
                 placeholder="Enter your Name"
                 type="string"
                 id="nameInput"/>
        </div>
      </div>

      {/* Availability Type Toggle */}
      <div className="mt-5 py-3">
        <div className="inline-flex rounded-md bg-gray-800 p-1 w-full">
          <Button
            onPress={() => setSelectedType(Availability.Available)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedType === Availability.Available
              ? 'bg-emerald-600 text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Available
          </Button>
          <Button
            onPress={() => setSelectedType(Availability.IfNeeded)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedType === Availability.IfNeeded
              ? 'bg-amber-500 text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            If Needed
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleLoad}
          className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-300 transition-all duration-200 text-sm font-medium"
        >
          Load Availability
        </button>
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all duration-200 text-sm font-medium"
        >
          Submit Availability
        </button>
        <button
          onClick={clearAll}
          className="w-full px-6 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
