import React, { useState } from "react";
import Calendar from "react-calendar"; // Import the calendar library
import "react-calendar/dist/Calendar.css"; // Import the library's styling

export default function Dashboard() {
    const [date, setDate] = useState(new Date()); // State to manage the current calendar date

    const handleDateChange = (newDate) => {
        setDate(newDate); // Update the selected date
    };

    return (
        <div className="container my-5">
            <h1 className="text-center text-primary mb-4">Dashboard</h1>
            <p className="text-center mb-4">
                Welcome to your dashboard. You can view and manage important events below in the calendar.
            </p>

            {/* Render the calendar */}
            <div className="calendar-container mx-auto" style={{ maxWidth: "400px" }}>
                <Calendar onChange={handleDateChange} value={date} />
            </div>

            {/* Display the selected date */}
            <div className="text-center mt-4">
                <h5>Selected Date: {date.toDateString()}</h5>
            </div>
        </div>
    );
}