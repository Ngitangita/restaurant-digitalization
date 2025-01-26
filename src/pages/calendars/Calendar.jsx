import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const TheCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Événement Toute la journée',
      start: new Date(),
      end: new Date(),
      allDay: true,
    },
    {
      title: 'Événement Long',
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
    const title = prompt('Nom de l\'événement');
    if (title) {
      const start = slotInfo.start;
      const end = prompt('Entrez la date de fin (yyyy-mm-dd)', moment(start).add(1, 'day').format('YYYY-MM-DD'));
      if (end) {
        const endDate = new Date(end);
        if (endDate > start) {
          setEvents([
            ...events,
            {
              title,
              start: new Date(start),
              end: endDate,
              allDay: slotInfo.slots.length === 1,
            },
          ]);
        } else {
          alert('La date de fin doit être après la date de début');
        }
      }
    }
  };

  const CustomToolbar = (toolbar) => {
    const isActive = (button) => activeButton === button;

    return (
      <div className="CalendarHead bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            className={`${isActive('today') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('TODAY');
              setActiveButton('today');
            }}
          >
            Aujourd'hui
          </button>
          <button 
            className={`${isActive('prev') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('PREV');
              setActiveButton('prev');
            }}
          >
            Précédent
          </button>
          <button 
            className={`${isActive('next') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('NEXT');
              setActiveButton('next');
            }}
          >
            Suivant
          </button>
        </div>
        <span className="text-lg font-semibold dark:text-white">{moment(toolbar.date).format('MMMM YYYY')}</span>
        <div className="flex space-x-4">
          <button 
            className={`${isActive('month') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('month');
              setActiveButton('month');
            }}
          >
            Mois
          </button>
          <button 
            className={`${isActive('week') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('week');
              setActiveButton('week');
            }}
          >
            Semaine
          </button>
          <button 
            className={`${isActive('day') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('day');
              setActiveButton('day');
            }}
          >
            Jour
          </button>
          <button 
            className={`${isActive('agenda') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`} 
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
    <div className="w-[970px]">
      <div className="Calendar w-full max-w-full rounded-sm border border-gray-300 bg-white shadow-default dark:border-gray-600 dark:bg-gray-800 p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable={true}
          onSelectEvent={(event) => {
            const confirmDelete = window.confirm(`Voulez-vous supprimer l'événement '${event.title}' ?`);
            if (confirmDelete) {
              handleDeleteEvent(event);
            }
          }}
          onSelectSlot={(slotInfo) => handleAddEvent(slotInfo)}
          components={{
            toolbar: CustomToolbar,
          }}
          className="dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  );
};

export default TheCalendar;
