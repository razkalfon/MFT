import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";

function Calendar() {
  const [dateInput, setDateInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [events, setEvents] = useState([]);

  const handleDateClick = (info) => {
    const date = info.dateStr;
    const note = prompt("הוסף הערה:");

    if (note) {
      setEvents((prevEvents) => [
        ...prevEvents,
        { title: note, date: date, display: "block" },
      ]);
    }
  };

  const handleAddNote = () => {
    if (dateInput && noteInput) {
      setEvents((prevEvents) => [
        ...prevEvents,
        { title: noteInput, date: dateInput, display: "block" },
      ]);
    }
  };

  return (
    <div className="uniqueCalendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
        }}
        height={"90vh"}
        dateClick={handleDateClick}
        events={events} // הוסף את האירועים לקורס FullCalendar
      />

      <div className="mont">
        <h2>:סיכום חודשי </h2>
      </div>

      <div className="noteInputContainer">
        <input
          type="date"
          placeholder="תאריך (YYYY-MM-DD)"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="הוסף הערה"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        />
        <button onClick={handleAddNote}>הוסף הערה</button>
      </div>
    </div>
  );
}

export default Calendar;
