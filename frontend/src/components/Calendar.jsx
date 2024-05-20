import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
const tempEmail = window.tempemail;

function Calendar() {
  const [events, setEvents] = useState([]);
  const [dailyProfits, setDailyProfits] = useState({});

  useEffect(() => {
    fetchEvents();
    fetchDailyProfits();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/api/get_stocksHistory/${tempEmail}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchDailyProfits = async () => {
    try {
      const response = await axios.get(`/api/get_dailyProfits/${tempEmail}`);
      setDailyProfits(response.data);
    } catch (error) {
      console.error("Error fetching daily profits:", error);
    }
  };

  const handleDateClick = async (info) => {
    const date = info.dateStr;
    const note = prompt("הוסף הערה:");

    if (note) {
      try {
        await axios.post(`/api/create_calendar/${tempEmail}`, { note: note });
        fetchEvents(); // רענון של רשימת האירועים לאחר הוספת אירוע חדש
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };

  const eventRender = (info) => {
    const eventDate = info.event.startStr.slice(0, 10);
    const profit = dailyProfits[eventDate];
    if (profit !== undefined) {
      const content = `<div>${info.event.title}</div><div>Profit: ${profit}</div>`;
      info.el.innerHTML = content;
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
        events={events}
        eventRender={eventRender}
      />

      <div className="mont">
        <h2>:סיכום חודשי </h2>
        {/* כאן יש להציג את הסיכום החודשי של רווח היום */}
      </div>

      <div className="noteInputContainer">
        {/* כאן יש להוסיף פורם להוספת הערות חדשות */}
      </div>
    </div>
  );
}

export default Calendar;
