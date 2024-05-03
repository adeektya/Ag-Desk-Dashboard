import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
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

const inventoryItems = [
  { name: 'Seeds', quantity: 20 },
  { name: 'Fertilizer', quantity: 50 },
  { name: 'Feed', quantity: 5 },
  // ...other items
];
const lowInventoryThreshold = 10;

const DataStatsThree: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://127.0.0.1:8000/user/user/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const handleRemoveTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };
  const [weather, setWeather] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          'https://api.tomorrow.io/v4/weather/forecast',
          {
            params: {
              location: 'brisbane',
              apikey: apiKey,
            },
          }
        );
        setWeather(response.data.timelines.minutely[0].values);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeather();
    console.log('weather', weather);
  }, []);
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
              Weather in Brisbane
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
              Todos
            </Typography>
            <div>
              <TextField
                label="Add new todo"
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
              {todos.map((todo, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveTodo(index)}
                      className="list-item"
                    >
                      {/* Removed Checkbox from secondary action */}
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.completed}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleToggleComplete(index)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={todo.text}
                    style={
                      todo.completed ? { textDecoration: 'line-through' } : {}
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="card-content">
            <Typography variant="h5" component="h2">
              Inventory Status
            </Typography>
            <List>
              {inventoryItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {/* Replace with an appropriate icon for the item */}
                    <Badge badgeContent={item.quantity} color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  {item.quantity <= lowInventoryThreshold && (
                    <WarningIcon color="error" className="warning-icon" /> // Added class for styling
                  )}
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
