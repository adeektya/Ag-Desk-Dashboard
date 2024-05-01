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
import { TaskCardProps } from '../../types/TaskCardProps';

const TaskCardDashboard: React.FC = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the API when the component mounts
    axios
      .get('http://127.0.0.1:8000/api/tasks/')
      .then((response) => {
        // Update the tasks state with the fetched data
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const toggleTaskCompletion = (taskId, completed) => {
    
    // Send an HTTP PATCH request to update the task's completion status
    axios
      .patch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, { completed })
      .then((response) => {
        // Update the tasks state with the updated task data
        const updatedTask = response.data;
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        );
        setTasks(updatedTasks);
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
                secondary={task.subtasks.join(', ')}
                className={`task-text ${task.completed ? 'completed' : ''} ${
                  task.severity
                }`}
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
