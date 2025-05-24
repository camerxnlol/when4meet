'use client'
import React, { useState } from 'react';

const When3meet = () => {
    // Generate time slots (9 AM to 9 PM in 30-minute intervals)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
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

    // Generate days of the week
    const generateDays = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days;
    };

    const timeSlots = generateTimeSlots();
    const days = generateDays();

    // State to track availability - using a Set for selected 15-minute blocks
    const [availability, setAvailability] = useState(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState(null); // 'select' or 'deselect'

    // Create unique key for each 15-minute block
    const createSlotKey = (day, time, half) => `${day}-${time}-${half}`;

    // Handle mouse events for selecting/deselecting time slots
    const handleMouseDown = (day, time, half) => {
        if (half === 'both') {
            // Handle full 30-minute block
            const firstKey = createSlotKey(day, time, 'first');
            const secondKey = createSlotKey(day, time, 'second');
            const bothSelected = availability.has(firstKey) && availability.has(secondKey);

            setIsDragging(true);
            setDragMode(bothSelected ? 'deselect' : 'select');

            const newAvailability = new Set(availability);
            if (bothSelected) {
                newAvailability.delete(firstKey);
                newAvailability.delete(secondKey);
            } else {
                newAvailability.add(firstKey);
                newAvailability.add(secondKey);
            }
            setAvailability(newAvailability);
        } else {
            // Original logic for individual 15-minute blocks
            const key = createSlotKey(day, time, half);
            const isSelected = availability.has(key);

            setIsDragging(true);
            setDragMode(isSelected ? 'deselect' : 'select');

            const newAvailability = new Set(availability);
            if (isSelected) {
                newAvailability.delete(key);
            } else {
                newAvailability.add(key);
            }
            setAvailability(newAvailability);
        }
    };

    const handleMouseEnter = (day, time, half) => {
        if (!isDragging) return;

        if (half === 'both') {
            // Handle full 30-minute block
            const firstKey = createSlotKey(day, time, 'first');
            const secondKey = createSlotKey(day, time, 'second');
            const newAvailability = new Set(availability);

            if (dragMode === 'select') {
                newAvailability.add(firstKey);
                newAvailability.add(secondKey);
            } else {
                newAvailability.delete(firstKey);
                newAvailability.delete(secondKey);
            }
            setAvailability(newAvailability);
        } else {
            // Original logic for individual 15-minute blocks
            const key = createSlotKey(day, time, half);
            const newAvailability = new Set(availability);

            if (dragMode === 'select') {
                newAvailability.add(key);
            } else {
                newAvailability.delete(key);
            }
            setAvailability(newAvailability);
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
        console.log('Selected availability:', availabilityArray);
        alert(`Selected ${availabilityArray.length} 15-minute blocks!`);
    };

    const clearAll = () => {
        setAvailability(new Set());
    };

    // Check if a 15-minute block is selected
    const isBlockSelected = (day, time, half) => {
        return availability.has(createSlotKey(day, time, half));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-light tracking-wide text-white mb-2">
                        when3meet
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Select your availability • Click and drag to fill
                    </p>
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

                {/* Grid container */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Header with days */}
                        <div className="flex border-b border-gray-600">
                            <div className="w-16 flex-shrink-0 border-r border-gray-600"></div> {/* Empty corner */}
                            {days.map(day => (
                                <div
                                    key={day}
                                    className="flex-1 min-w-[80px] text-center font-medium text-gray-300 py-3 text-sm border-r border-gray-600"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time slots grid */}
                        {timeSlots.map((time, timeIndex) => (
                            <div key={time} className="flex border-b border-gray-700">
                                {/* Time label */}
                                <div className="w-16 flex-shrink-0 text-right pr-3 py-1 text-xs text-gray-400 font-mono flex items-center justify-end border-r border-gray-600">
                                    {time}
                                </div>

                                {/* Availability cells for each day */}
                                {days.map(day => {
                                    const firstHalf = isBlockSelected(day, time, 'first');
                                    const secondHalf = isBlockSelected(day, time, 'second');

                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className="flex-1 min-w-[80px] h-6 border-r border-gray-600"
                                        >
                                            {/* Single column that handles both 15-minute blocks */}
                                            <div
                                                className={`w-full h-full cursor-pointer transition-all duration-150 ${firstHalf && secondHalf
                                                        ? 'bg-emerald-500 hover:bg-emerald-400'
                                                        : firstHalf || secondHalf
                                                            ? 'bg-emerald-400 hover:bg-emerald-300'
                                                            : 'bg-gray-800 hover:bg-gray-700'
                                                    }`}
                                                onMouseDown={() => handleMouseDown(day, time, 'both')}
                                                onMouseEnter={() => handleMouseEnter(day, time, 'both')}
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
                        {availability.size} blocks selected
                    </p>
                </div>
            </div>
        </div>
    );
};

export default When3meet;