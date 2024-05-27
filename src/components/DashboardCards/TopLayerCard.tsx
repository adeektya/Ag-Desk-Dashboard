import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useFarm } from '../../contexts/FarmContext';
import { WiDaySunny } from 'weather-icons-react';
import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { Badge } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import AddBoxIcon from '@mui/icons-material/AddBox';
import './topcards.css';
import BASE_URL from '../../../config';  // Adjust the path as needed



const DataStatsThree: React.FC = () => {
  const { activeFarm } = useFarm();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]); // State to store notes data
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${BASE_URL}/user/user/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setUser(response.data);
          console.log("userdata response"+response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  // fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (activeFarm) {
        const response = await axios.get(`${BASE_URL}/api/note_list/`, {
          params: {
            farm_id: activeFarm.id
          }
        });
        setNotes(response.data);
        console.log('response:', response.data);
      }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
  
    fetchNotes();
  }, [activeFarm]); // Make sure to include activeFarm in the dependency array
  
    // Fetch inventory data
    useEffect(() => {
      if (activeFarm ) {
        fetchInventoryItems();
      }
    }, [activeFarm]);
  
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/inventory/?farm_id=${activeFarm.id}`);
        const data = response.data.filter(inventoryitem => inventoryitem.status === 'needs repair'||inventoryitem.status === "service due");
        
        setInventory(data);
      } catch (error) {
        console.error('Failed to fetch inventory items:', error);
      }
    };
  
  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      // Post the new note to the backend
      postNote({ text: newTodo, completed: false });
      // Add the new todo locally
      setTodos([...todos, { text: newTodo, completed: false }]);
      // Clear the input field after adding the todo
      setNewTodo('');
    }
  };
  const postNote = async (noteData) => {
    try {
      noteData.farm = activeFarm.id;
      const response = await axios.post(`${BASE_URL}/api/note_list/`, noteData);
      console.log('Note posted successfully:', response.data);
      // Update the notes state to include the newly added note
      setNotes([...notes, response.data]);
      // Clear the input field after adding the note
      setNewTodo('');
    } catch (error) {
      console.error('Error posting note:', error);
    }
  };

  const handleToggleComplete = async (noteId) => {
    try {
      // Delete the note from the backend
      await axios.delete(`${BASE_URL}/api/note_detail/${noteId}/`);
  
      // Update the notes state to remove the deleted note
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleRemoveTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };
  const [weather, setWeather] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (activeFarm) {
      fetchWeather();
    }
  }, [activeFarm]);


    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          'https://api.tomorrow.io/v4/weather/forecast',
          {
            params: {
              location: activeFarm.address,
              apikey: apiKey,
            },
          }
        );
        setWeather(response.data.timelines.minutely[0].values);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
   
  return (
    <div>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-sm2 font-bold text-black dark:text-white">
            Welcome, {user ? user.username : 'User'}
          </h2>
        </div>
      </div>

      <div className="over grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <Card className="card weather-card">
          <CardContent className="card-content">
            <Typography
              color="text.secondary"
              gutterBottom
              className="weather-card-title"
            >
              Weather in {activeFarm ? activeFarm.address : 'loading...'}
            </Typography>
            {weather ? (
              <>
                <div className="weather-icon-container">
                  <WiDaySunny size={96} color="#000" />
                </div>
                <Typography
                  variant="h5"
                  component="div"
                  className="weather-temp"
                >
                  {weather.temperature.toFixed(1)}°C{' '}
                  {/* Round the temperature to one decimal place */}
                </Typography>
                <Typography
                  sx={{ mb: 1.5 }}
                  color="text.secondary"
                  className="weather-details"
                >
                  Humidity: {weather.humidity}%
                </Typography>
                <Typography variant="body2" className="weather-details">
                  Wind Speed: {weather.windSpeed.toFixed(2)} m/s{' '}
                  {/* Round the wind speed to two decimal places */}
                  <br />
                  Visibility: {weather.visibility} km
                </Typography>
              </>
            ) : (
              <Typography variant="body2">Loading weather...</Typography>
            )}
          </CardContent>
        </Card>

        <Card className="card overflow-y-hidden">
          <CardContent className="card-content">
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
              className="todo-card-header" // Added class for a bigger heading
            >
              Important Notes
            </Typography>
            <div>
              <TextField
                label="Add notes"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                className="text-field-outlined" // Added class for styling
              />
              <IconButton
                onClick={handleAddTodo}
                color="primary"
                aria-label="add todo"
                className="add-icon" // Added class for styling
              >
                <AddBoxIcon />
              </IconButton>
            </div>
            <List>
      {notes.map((note) => (
        <ListItem key={note.id}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={note.completed}
              tabIndex={-1}
              disableRipple
              // Add functionality to toggle completion if needed
              onChange={() => handleToggleComplete(note.id)}
            />
          </ListItemIcon>
          <ListItemText
            primary={note.text}
            style={note.completed ? { textDecoration: 'line-through' } : {}}
          />
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleRemoveTodo(note.id)} // Assuming `note.id` uniquely identifies each note
            className="list-item"
          >
            {/* Add delete icon if needed */}
          </IconButton>
        </ListItem>
      ))}
    </List>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="card-content">
            <Typography variant="h5" component="h2">
              Inventory Maintance
            </Typography>
            <List>
              {inventory.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                  <WarningIcon color="error" className="warning-icon" />
                    
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <ListItemText
              primary={item.status} // Add the status field here
              className='item-details'
            />
            
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataStatsThree;
