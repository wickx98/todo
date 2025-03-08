import React, { useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Box, Typography, CircularProgress, Tooltip, IconButton } from '@mui/material';
import { format } from 'date-fns';
import moment from 'moment'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());  // Track the current date
  const n = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const db = getFirestore();
      const tasksRef = collection(db, `users/${currentUser.uid}/tasks`);
      const fetchTasks = async () => {
        try {
          const querySnapshot = await getDocs(tasksRef);
          const tasksArray = querySnapshot.docs.map((doc) => {
            const taskData = doc.data();
            return {
              id: doc.id,
              title: taskData.name,
              start: taskData.createdAt.toDate(),
              end: taskData.deadline.toDate(),
              description: taskData.description,
              priority: taskData.priority,
              status: taskData.status,
              categoryColor: taskData.categories[0]?.color,
              categoryEmoji: taskData.categories[0]?.emoji,
            };
          });

          setTasks(tasksArray);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setLoading(false);
        }
      };
      fetchTasks();
    }
  }, []);

  const handleEventClick = (event: any) => {
    n(`/task/${event.id}`); 
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Tasks Calendar
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <IconButton onClick={handlePrevMonth} sx={{ padding: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ padding: 1 }}>
          <ArrowForward />
        </IconButton>
      </Box>

      <Calendar
        localizer={localizer}
        events={tasks}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, borderRadius: '8px' }}
        onSelectEvent={handleEventClick}
        views={['month', 'week', 'day']} // Allow users to switch views
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.categoryColor || '#3f51b5',
            color: 'white',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add shadow for depth
            padding: '5px',
            fontSize: '12px', // Adjust font size
          },
        })}
        components={{
          event: ({ event }) => (
            <Tooltip title={event.description} placement="top">
              <div style={{ padding: '5px', borderRadius: '5px' }}>
                {event.categoryEmoji && (
                  <span style={{ marginRight: '5px', fontSize: '16px' }}>
                    {String.fromCodePoint(`0x${event.categoryEmoji}`)}
                  </span>
                )}
                {event.title}
              </div>
            </Tooltip>
          ),
        }}
      />
    </Box>
  );
};

export default CalendarPage;
