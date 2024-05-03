import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  TextField,
  FormGroup,
  Select,
  MenuItem,
} from '@mui/material';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [calEvents, setCalEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [severity, setSeverity] = useState('low');
  const [update, setUpdate] = useState(null);
  const [isTask, setIsTask] = useState(false);

  useEffect(() => {
    fetchCalendarEvents();
    fetchTasksWithDueDate();
  }, []);

  const fetchCalendarEvents = () => {
    axios
      .get('http://127.0.0.1:8000/calendar/events/')
      .then((response) => {
        const formattedEvents = response.data.map((event) => ({
          ...event,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
          color: getEventSeverityColor(event.severity),
        }));
        setCalEvents(formattedEvents);
      })
      .catch((error) => {
        console.error('Error fetching calendar events:', error);
      });
  };

  const fetchTasksWithDueDate = () => {
    axios
      .get('http://127.0.0.1:8000/api/tasks/')
      .then((response) => {
        const tasksWithDueDate = response.data.filter((task) => task.due_date);
        const formattedTasks = tasksWithDueDate.map((task) => ({
          ...task,
          taskId: task.id,
          start: new Date(task.due_date),
          end: new Date(task.due_date),
          color: getTaskSeverityColor(task.severity),
        }));
        setTasks(formattedTasks);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  };

  const getEventSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
    }
  };

  const getTaskSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
    }
  };

  const addNewEventAlert = (slotInfo) => {
    setOpen(true);
    setStartDate(slotInfo.start);
    setEndDate(slotInfo.end);
  };

  const editEvent = (event) => {
    console.log('Event:', event);
    setOpen(true);
    if (event.taskId) {
      setTitle(event.title);
      setStartDate(event.start);
      setEndDate(event.end);
      setSeverity(event.severity);
      setIsTask(true);
      setUpdate({ ...event, id: event.taskId });
    } else {
      setTitle(event.title);
      setStartDate(event.start);
      setEndDate(event.end);
      setSeverity(event.severity);
      setIsTask(false);
      setUpdate(event);
    }
  };

  const updateEvent = (e) => {
    e.preventDefault();
    if (!update) {
      console.error('No event selected for update.');
      return;
    }

    const eventData = {
      title,
      start_time: startDate,
      end_time: endDate,
      severity,
    };

    if (isTask) {
      axios
        .put(`http://127.0.0.1:8000/api/tasks/${update.id}/`, eventData)
        .then((response) => {
          fetchTasksWithDueDate();
          setOpen(false);
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    } else {
      axios
        .put(`http://127.0.0.1:8000/calendar/events/${update.id}/`, eventData)
        .then((response) => {
          fetchCalendarEvents();
          setOpen(false);
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating calendar event:', error);
        });
    }
  };

  const createEvent = (e) => {
    e.preventDefault();

    const eventData = {
      title,
      start_time: startDate,
      end_time: endDate,
      severity,
    };

    axios
      .post('http://127.0.0.1:8000/calendar/events/', eventData)
      .then((response) => {
        fetchCalendarEvents();
        setOpen(false);
        resetForm();
      })
      .catch((error) => {
        console.error('Error creating calendar event:', error);
      });
  };

  const deleteEvent = (event) => {
    if (isTask) {
      axios
        .delete(`http://127.0.0.1:8000/api/tasks/${event.id}/`)
        .then((response) => {
          fetchTasksWithDueDate();
          setOpen(false);
          resetForm();
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
        });
    } else {
      axios
        .delete(`http://127.0.0.1:8000/calendar/events/${event.id}/`)
        .then((response) => {
          fetchCalendarEvents();
          setOpen(false);
          resetForm();
        })
        .catch((error) => {
          console.error('Error deleting calendar event:', error);
        });
    }
  };

  const resetForm = () => {
    setTitle('');
    setStartDate(new Date());
    setEndDate(new Date());
    setSeverity('low');
    setUpdate(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const eventColors = (event) => {
    return { className: `event-${event.color}` };
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Calendar" />

      {/* <!-- ====== Calendar Section Start ====== --> */}
      <Card className="calendar-card dark:border-strokedark dark:bg-boxdark">
        <CardContent>
          <BigCalendar
            selectable
            events={[...calEvents, ...tasks]}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 350px' }}
            onSelectEvent={(event) => editEvent(event)}
            onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
            eventPropGetter={eventColors}
            className="calendar-container"
          />
          <Modal open={open} onClose={handleClose} className="calendar-modal">
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              <h2 className="modal-title">
                {update ? 'Update Event' : 'Add Event'}
              </h2>
              <Box
                className="modal-form"
                component="form"
                onSubmit={update ? updateEvent : createEvent}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="event-title"
                  label="Event Title"
                  name="title"
                  autoComplete="title"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="start-date"
                  label="Start Date"
                  type="datetime-local"
                  value={moment(startDate).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="form-input"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="end-date"
                  label="End Date"
                  type="datetime-local"
                  value={moment(endDate).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="form-input"
                />
                <FormGroup className="form-group">
                  <Select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'severity' }}
                    className="form-select"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormGroup>
                <Button
                  className="form-button"
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {update ? 'Update' : 'Add'}
                </Button>
                {update && (
                  <Button
                    className="form-button delete-button"
                    variant="outlined"
                    color="error"
                    onClick={() => deleteEvent(update)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Box>
          </Modal>
        </CardContent>
      </Card>
      {/* <!-- ====== Calendar Section End ====== --> */}
    </DefaultLayout>
  );
};

export default Calendar;
