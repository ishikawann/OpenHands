import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setModalOpen(true);
  };

  const handleAddEvent = (title) => {
    if (title) {
      const newEvent = {
        title,
        start: selectedDate,
        allDay: true,
        id: new Date().toISOString()
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(title);
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
          <button type="submit">Add</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default App;