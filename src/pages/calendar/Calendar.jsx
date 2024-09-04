import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const localizer = momentLocalizer(moment);

const TheCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'All Day Event',
      start: new Date(),
      end: new Date(),
      allDay: true,
    },
    {
      title: 'Long Event',
      start: new Date(2024, 8, 23),
      end: new Date(2024, 8, 29),  
    },
  ]);

  
  const [activeButton, setActiveButton] = useState('');

  const handleDeleteEvent = (eventToDelete) => {
    const filteredEvents = events.filter(event => event !== eventToDelete);
    setEvents(filteredEvents);
  };

  const handleAddEvent = (slotInfo) => {
    const title = prompt('Event name');
    if (title) {
      const start = slotInfo.start;
      const end = prompt('Enter end date (yyyy-mm-dd)', moment(start).add(1, 'day').format('YYYY-MM-DD'));
      if (end) {
        setEvents([
          ...events,
          {
            title,
            start: new Date(start),
            end: new Date(end),
            allDay: slotInfo.slots.length === 1,
          },
        ]);
      }
    }
  };

  const CustomToolbar = (toolbar) => {
    const isActive = (button) => activeButton === button;

    return (
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            className={`${isActive('today') ? 'bg-black text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('TODAY');
              setActiveButton('today');
            }}
          >
            Today
          </button>
          <button 
            className={`${isActive('prev') ? 'bg-black text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('PREV');
              setActiveButton('prev');
            }}
          >
            Back
          </button>
          <button 
            className={`${isActive('next') ? 'bg-black text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('NEXT');
              setActiveButton('next');
            }}
          >
            Next
          </button>
        </div>
        <span className="text-lg font-semibold">{moment(toolbar.date).format('MMMM YYYY')}</span>
        <div className="flex space-x-4">
          <button 
            className={`${isActive('month') ? 'bg-black text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('month');
              setActiveButton('month');
            }}
          >
            Month
          </button>
          <button 
            className={`${isActive('week') ? 'bg-black text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('week');
              setActiveButton('week');
            }}
          >
            Week
          </button>
          <button 
            className={`${isActive('day') ? 'bg-black text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('day');
              setActiveButton('day');
            }}
          >
            Day
          </button>
          <button 
            className={`${isActive('agenda') ? 'bg-black text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('agenda');
              setActiveButton('agenda');
            }}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pl-10 relative w-[970px] left-[250px]">
      <Breadcrumb pageName="Calendar" />
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500}}
          selectable={true}
          onSelectEvent={(event) => {
            const confirmDelete = window.confirm(`Do you want to delete the event '${event.title}'?`);
            if (confirmDelete) {
              handleDeleteEvent(event);
            }
          }}
          onSelectSlot={(slotInfo) => handleAddEvent(slotInfo)}
          components={{
            toolbar: CustomToolbar,  
          }}
        />
      </div>
    </div>
  );
};

export default TheCalendar;
