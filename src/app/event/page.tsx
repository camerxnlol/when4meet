'use client';
import React from 'react';
import EventWhen4meet from '@/components/Event';
import { useEvent } from '../../context/EventContext'

// Get multiple weeks starting from the current week
const getMultipleWeeks = (numWeeks = 4) => {
    const today = new Date();
    const allDates = [];

    // Get the start of the current week (Sunday)
    const startOfCurrentWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    startOfCurrentWeek.setDate(today.getDate() - dayOfWeek);

    // Generate multiple weeks
    for (let week = 0; week < numWeeks; week++) {
        for (let day = 0; day < 7; day++) {
            const date = new Date(startOfCurrentWeek);
            date.setDate(startOfCurrentWeek.getDate() + (week * 7) + day);
            allDates.push(date);
        }
    }

    return allDates;
};

export default function EventPage() {
    // Generate 1 week of dates
    const allWeeksData = {
        name: "Sample Event Name",
        dates: getMultipleWeeks(1),
    };

    // if (!eventData) return <p>Loading...</p>;
    return <EventWhen4meet eventData={allWeeksData} />;
} 