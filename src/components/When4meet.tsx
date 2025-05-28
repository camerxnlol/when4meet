'use client'
import React, { useState } from 'react';

interface EventData {
    name: string
    dates: Date[]
}

interface When4meetProps {
    eventData: EventData
}

type AvailabilityType = 'available' | 'if-needed';

const When4meet: React.FC<When4meetProps> = ({ eventData }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const daysPerPage = 7;
    const [selectedType, setSelectedType] = useState<AvailabilityType>('available');

    // Generate time slots (9 AM to 12 AM in 30-minute intervals)
    const generateTimeSlots = () => {
        const slots: string[] = [];
        for (let hour = 9; hour <= 23; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = new Date();
                time.setHours(hour, minute, 0, 0);
                const timeStr = time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }).replace(' ', '');
                slots.push(timeStr);
            }
        }
        return slots;
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const timeSlots = generateTimeSlots();
    const totalPages = Math.ceil(eventData.dates.length / daysPerPage);
    const currentDates = eventData.dates.slice(
        currentPage * daysPerPage,
        (currentPage + 1) * daysPerPage
    );

    // State to track availability - using a Set for selected 15-minute blocks
    const [availability, setAvailability] = useState<Set<string>>(new Set());
    const [ifNeeded, setIfNeeded] = useState<Set<string>>(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

    // Create unique key for each 15-minute block
    const createSlotKey = (date: Date, time: string, half: string): string =>
        `${date.toISOString()}-${time}-${half}`;

    // Handle mouse events for selecting/deselecting time slots
    const handleMouseDown = (date: Date, time: string, half: string) => {
        if (half === 'both') {
            // Handle full 30-minute block
            const firstKey = createSlotKey(date, time, 'first');
            const secondKey = createSlotKey(date, time, 'second');
            const currentSet = selectedType === 'available' ? availability : ifNeeded;
            const bothSelected = currentSet.has(firstKey) && currentSet.has(secondKey);

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
            // Original logic for individual 15-minute blocks
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
            // Original logic for individual 15-minute blocks
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

    const handleSubmit = () => {
        const availabilityArray = Array.from(availability);
        const ifNeededArray = Array.from(ifNeeded);
        console.log('Selected availability:', availabilityArray);
        console.log('If needed:', ifNeededArray);
        alert(`Selected ${availabilityArray.length} available blocks and ${ifNeededArray.length} if-needed blocks!`);
    };

    const clearAll = () => {
        setAvailability(new Set());
        setIfNeeded(new Set());
    };

    // Check if a 15-minute block is selected
    const isBlockSelected = (date: Date, time: string, half: string): { available: boolean; ifNeeded: boolean } => {
        const key = createSlotKey(date, time, half);
        return {
            available: availability.has(key),
            ifNeeded: ifNeeded.has(key)
        };
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-light tracking-wide text-white mb-2">
                        {eventData.name}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Select your availability • Click and drag to fill
                    </p>
                </div>

                {/* Availability Type Toggle */}
                <div className="mb-8 flex justify-center">
                    <div className="inline-flex rounded-md bg-gray-800 p-1">
                        <button
                            onClick={() => setSelectedType('available')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedType === 'available'
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Available
                        </button>
                        <button
                            onClick={() => setSelectedType('if-needed')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedType === 'if-needed'
                                ? 'bg-amber-500 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            If Needed
                        </button>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="mb-8 flex gap-3 justify-center">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all duration-200 text-sm font-medium"
                    >
                        Save
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-6 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
                    >
                        Clear
                    </button>
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div className="mb-4 flex justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ←
                        </button>
                        <span className="px-3 py-1 text-gray-300">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            →
                        </button>
                    </div>
                )}

                {/* Grid container */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Header with dates */}
                        <div className="flex border-b border-gray-600">
                            <div className="w-16 flex-shrink-0 border-r border-gray-600"></div> {/* Empty corner */}
                            {currentDates.map(date => (
                                <div
                                    key={date.toISOString()}
                                    className="flex-1 min-w-[80px] text-center font-medium text-gray-300 py-3 text-sm border-r border-gray-600"
                                >
                                    {formatDate(date)}
                                </div>
                            ))}
                        </div>

                        {/* Time slots grid */}
                        {timeSlots.map((time, timeIndex) => (
                            <div key={`time-${timeIndex}-${time}`} className="flex border-b border-gray-700">
                                {/* Time label */}
                                <div className="w-16 flex-shrink-0 text-right pr-3 py-1 text-xs text-gray-400 font-mono flex items-center justify-end border-r border-gray-600">
                                    {time}
                                </div>

                                {/* Availability cells for each date */}
                                {currentDates.map(date => {
                                    const firstHalf = isBlockSelected(date, time, 'first');
                                    const secondHalf = isBlockSelected(date, time, 'second');

                                    return (
                                        <div
                                            key={`${date.toISOString()}-${timeIndex}-${time}`}
                                            className="flex-1 min-w-[80px] h-6 border-r border-gray-600"
                                        >
                                            {/* Single column that handles both 15-minute blocks */}
                                            <div
                                                className={`w-full h-full cursor-pointer transition-all duration-150 ${firstHalf.available && secondHalf.available
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

                {/* Footer info */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        {availability.size} available blocks, {ifNeeded.size} if-needed blocks
                    </p>
                </div>
            </div>
        </div>
    );
};

export default When4meet;