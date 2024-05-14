import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Chip,
} from '@mui/material';
import './taskcard.css';
import { useFarm } from '../../contexts/FarmContext';
import { TaskCardProps } from '../../types/TaskCardProps';

const TaskCardDashboard: React.FC = () => {
  const { activeFarm } = useFarm();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the API when the component mounts
    axios
      .get(`http://127.0.0.1:8000/api/tasks/?farm_id=${activeFarm.id}`)
      .then((response) => {
        const incompleteTasks = response.data.filter(task => task.status !== 'completed');
        setTasks(incompleteTasks);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, [activeFarm.id]); // Add activeFarm.id to the dependency array
  

  const toggleTaskCompletion = (taskId, completed) => {
    axios
      .patch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, { status: 'completed' })
      .then((response) => {
        // Update the tasks state with the updated task data
        const updatedTask = response.data;
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        );
        setTasks(updatedTasks);
  
        // Remove completed task from the list
        if (completed) {
          setTasks(updatedTasks.filter((task) => task.id !== taskId));
        }
      })
      .catch((error) => {
        console.error('Error updating task completion status:', error);
      });
  };
  

  return (
    <Card className="farm-tasks-card">
      <CardContent>
        <h2 className="card-title">Farm Tasks</h2>
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id} className="task-item">
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id, !task.completed)}
                color="primary"
                className="task-checkbox"
              />
              <ListItemText
                primary={task.title}
                secondary={task.subtasks
                  .map((subtask) => subtask.description)
                  .join(', ')}
                className={`task-text ${task.completed ? 'completed' : ''} ${
                  task.severity
                }`}
              />
              <ListItemText
              primary={task.status} // Add the status field here
              className='task-details'
            />
              <ListItemText
                primary={task.assigned_employee_name}
                secondary={task.due_date}
                className='task-details'
              />
              <Chip
                label={task.severity.toUpperCase()}
                size="small"
                className={`task-chip ${task.severity}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TaskCardDashboard;
