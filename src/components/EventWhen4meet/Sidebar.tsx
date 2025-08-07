import { Availability, AvailabilitySelection } from '@/lib/availability';
import React from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface SidebarProps {
  eventName: string;
  handleAddMember: () => void;
  hoverSlot: string;
  currentPage?: number;
  totalPages?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  eventName,
  handleAddMember,
  hoverSlot,
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
          {getWeekRange()} • Showing Availabilities
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
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddMember}
          className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-300 transition-all duration-200 text-sm font-medium"
        >
          Add Member
        </button>
        <button
          onClick={handleAddMember}
          className="w-full px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-300 transition-all duration-200 text-sm font-medium"
        >
          Remove Member
        </button>
      </div>
    </div>
  );
};
