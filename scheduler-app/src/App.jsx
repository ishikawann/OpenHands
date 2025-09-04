import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import holiday_jp from '@holiday-jp/holiday_jp';
import './App.css';

function App() {
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    try {
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch (error) {
      console.error("Failed to parse events from localStorage:", error);
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const fetchedHolidays = holiday_jp.between(new Date(currentYear, 0, 1), new Date(currentYear, 11, 31));
    setHolidays(fetchedHolidays.map(holiday => {
      const y = holiday.date.getFullYear();
      const m = String(holiday.date.getMonth() + 1).padStart(2, '0');
      const d = String(holiday.date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setModalOpen(true);
  };

  const handleAddEvent = (title, color) => {
    if (title) {
      const newEvent = {
        title,
        start: selectedDate,
        allDay: true,
        id: new Date().toISOString(),
        backgroundColor: color
      };
      setEvents([...events, newEvent]);
    }
    setModalOpen(false);
  };

  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        dateClick={handleDateClick}
        fixedWeekCount={true}
        height="auto"
        dayCellDidMount={function(info) {
          const y = info.date.getFullYear();
          const m = String(info.date.getMonth() + 1).padStart(2, '0');
          const d = String(info.date.getDate()).padStart(2, '0');
          const dateStr = `${y}-${m}-${d}`;
          if (holidays.includes(dateStr)) {
            info.el.classList.add('holiday');
          }
        }}
      />
      {modalOpen && (
        <EventForm
          onClose={() => setModalOpen(false)}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
}

function EventForm({ onClose, onAddEvent }) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#a0d8ef'); // デフォルトの色

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(title, color);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            required
          />
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="#a0d8ef">Blue</option>
            <option value="#98d8a8">Green</option>
            <option value="#f0e68c">Yellow</option>
            <option value="#c8a2c8">Purple</option>
            <option value="#f5bda6">Orange</option>
          </select>
          <button type="submit">Add</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default App;