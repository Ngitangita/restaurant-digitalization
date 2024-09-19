import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

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
      <div className="CalendarHead bg-blue-100 text-gray-500 p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            className={`${isActive('today') ? 'bg-black/35 text-white' : 'bg-blue-200 hover:bg-blue-100 text-gray-500'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('TODAY');
              setActiveButton('today');
            }}
          >
            Aujourd'hui
          </button>
          <button 
            className={`${isActive('prev') ? 'bg-black/35 text-white' : 'bg-blue-200 hover:bg-blue-100 text-gray-500'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('PREV');
              setActiveButton('prev');
            }}
          >
            Précédent
          </button>
          <button 
            className={`${isActive('next') ? 'bg-black/35 text-white' : 'bg-blue-200 hover:bg-blue-100 text-gray-500'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onNavigate('NEXT');
              setActiveButton('next');
            }}
          >
            Suivant
          </button>
        </div>
        <span className="text-lg font-semibold">{moment(toolbar.date).format('MMMM YYYY')}</span>
        <div className="flex space-x-4">
          <button 
            className={`${isActive('month') ? 'bg-black/35 text-white' : 'bg-blue-200 hover:bg-blue-100 text-gray-500'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('month');
              setActiveButton('month');
            }}
          >
            Mois
          </button>
          <button 
            className={`${isActive('week') ? 'bg-black/35 text-white' : 'bg-blue-200 hover:bg-blue-100 text-gray-500'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('week');
              setActiveButton('week');
            }}
          >
            Semaine
          </button>
          <button 
            className={`${isActive('day') ? 'bg-black/35 text-white' : 'bg-blue-200 hover:bg-blue-100 text-gray-500'} py-2 px-4 rounded`} 
            onClick={() => {
              toolbar.onView('day');
              setActiveButton('day');
            }}
          >
            Jour
          </button>
          <button 
            className={`${isActive('agenda') ? 'bg-black/35 text-white' : 'bg-blue-200 hover:bg-blue-100 text-gray-500'} py-2 px-4 rounded`} 
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
    <div className=" pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Calendrier" />
      <div className="Calendar w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
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
        />
      </div>
    </div>
  );
};

export default TheCalendar;
