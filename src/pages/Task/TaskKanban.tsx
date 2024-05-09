import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './taskkanban.css';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SwimLane from '../../components/Swimlanes/SwimLane.js';
import { fetchEmployees } from '../EmployeePage/api.js';
import { useFarm } from '../../contexts/FarmContext';

interface TaskDetails {
  type: string;
  title: string;
  severity: string;
  image: File | null;
  subtasks: { description: string }[];
  assignedEmployee: string; // Add this property
  dueDate?: string; // Add this property
}

interface FormErrors {
  type: string;
  title: string;
  severity: string;
}

const TaskKanban: React.FC = () => {
  const { activeFarm } = useFarm();
  const [formErrors, setFormErrors] = useState<FormErrors>({
    type: '',
    title: '',
    severity: '',
  });
  const [kanbanData, setKanbanData] = useState({
    todo: { tasks: [] },
    inProgress: { tasks: [] },
    onHold: { tasks: [] },
    completed: { tasks: [] },
  });
  const [open, setOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetails>({
    type: 'todo',
    title: '',
    severity: '',
    image: null,
    subtasks: [{ description: '' }],
    assignedEmployee: '',
  });
  const [employees, setEmployees] = useState([]);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskDetails, setEditTaskDetails] = useState<TaskDetails>({
    type: 'todo',
    title: '',
    severity: '',
    image: null,
    dueDate: '',
    subtasks: [{ description: '' }],
    assignedEmployee: '',
  });

  useEffect(() => {
    if (activeFarm) {
      fetchTasks();
    }
  }, [activeFarm]);

  const handleEditTask = (taskId: number) => {
    const taskToEdit = findTaskById(taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setEditTaskDetails({
        type: taskToEdit.status,
        title: taskToEdit.title,
        severity: taskToEdit.severity,
        image: null,
        dueDate: taskToEdit.due_date || '',
        subtasks: taskToEdit.subtasks,
        assignedEmployee: taskToEdit.assigned_employee,
      });
      setOpen(true);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
      console.log('Task deleted successfully');
      setKanbanData((prevState) => {
        let newState = { ...prevState };
        Object.keys(newState).forEach((status) => {
          newState[status].tasks = newState[status].tasks.filter(
            (task) => task.id !== taskId
          );
        });
        return newState;
      });
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchEmployees()
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get(`http://127.0.0.1:8000/api/tasks/?farm_id=${activeFarm.id}`)
      .then((response) => {
        const fetchedTasks = response.data;
        const tasksByStatus = fetchedTasks.reduce((acc, task) => {
          acc[task.status] = acc[task.status] || [];
          acc[task.status].push(task);
          return acc;
        }, {});
        setKanbanData({
          todo: { tasks: tasksByStatus.todo || [] },
          inProgress: { tasks: tasksByStatus.inProgress || [] },
          onHold: { tasks: tasksByStatus.onHold || [] },
          completed: { tasks: tasksByStatus.completed || [] },
        });
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const validateForm = (): boolean => {
    let errors: FormErrors = { type: '', title: '', severity: '' };
    if (!taskDetails.type) errors.type = 'Task type is required.';
    if (!taskDetails.title.trim()) errors.title = 'Task title is required.';
    if (!taskDetails.severity) errors.severity = 'Severity is required.';
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== '');
  };

  const onMoveTask = (taskId, newStatus) => {
    const taskToUpdate = findTaskById(taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status: newStatus };

      axios
        .put(`http://127.0.0.1:8000/api/tasks/${taskId}/`, updatedTask)
        .then((response) => {
          console.log('Task updated successfully on the server.');
          // Update the local state after the server update is successful
          setKanbanData((prevState) => {
            let newState = { ...prevState };
            // Remove the task from its current status list
            Object.keys(newState).forEach((status) => {
              newState[status].tasks = newState[status].tasks.filter(
                (task) => task.id !== taskId
              );
            });
            // Add the task to the new status list
            newState[newStatus].tasks.push(updatedTask);
            return newState;
          });
        })
        .catch((error) => {
          console.error('Error updating task status:', error);
          // Handle the error, show an error message, or revert the UI state
        });
    }
  };

  const updateLocalTaskState = (taskId, newStatus) => {
    setKanbanData((prevState) => {
      let newState = { ...prevState };
      // Remove the task from its current status list
      Object.keys(newState).forEach((status) => {
        newState[status].tasks = newState[status].tasks.filter(
          (task) => task.id !== taskId
        );
      });
      // Add the task to the new status list
      newState[newStatus].tasks.push({
        ...findTaskById(taskId),
        status: newStatus,
      });
      return newState;
    });
  };

  const findTaskById = (taskId: number) => {
    for (const status in kanbanData) {
      const task = kanbanData[status].tasks.find((task) => task.id === taskId);
      if (task) {
        return task;
      }
    }
    return null;
  };

  useEffect(() => {
    console.log('Component mounted. Initial kanban data:', kanbanData);
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTaskDetails({
      type: 'todo',
      title: '',
      severity: '',
      image: null,
      subtasks: [{ description: '' }],
      assignedEmployee: '',
    });
  };
  const handleSubtaskChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSubtasks = taskDetails.subtasks.map((subtask, subIndex) => {
      if (index === subIndex) {
        return { ...subtask, description: event.target.value };
      }
      return subtask;
    });
    setTaskDetails({ ...taskDetails, subtasks: newSubtasks });
  };

  const handleAddSubtask = () => {
    setTaskDetails({
      ...taskDetails,
      subtasks: [...taskDetails.subtasks, { description: '' }],
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setTaskDetails({
        ...taskDetails,
        image: event.target.files[0], // Set the selected file
      });
    }
  };

  const handleAddTaskSubmit = async () => {
    console.log('Submitting task:', taskDetails);
    if (!validateForm()) return;

    const taskData = {
      title: taskDetails.title,
      status: taskDetails.type,
      severity: taskDetails.severity,
      assigned_employee: taskDetails.assignedEmployee,
      due_date: taskDetails.dueDate,
      farm: activeFarm.id,
      subtasks: taskDetails.subtasks.map((subtask) => ({
        description: subtask.description,
        completed: false,
      })),
    };

    try {
      if (editingTaskId) {
        // Update existing task
        const response = await axios.put(
          `http://127.0.0.1:8000/api/tasks/${editingTaskId}/`,
          JSON.stringify(taskData),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const updatedTask = response.data;
        console.log('Task updated successfully:', updatedTask);
        setKanbanData((prevState) => {
          let newState = { ...prevState };
          // Remove the task from its current swimlane
          Object.keys(newState).forEach((status) => {
            newState[status].tasks = newState[status].tasks.filter(
              (task) => task.id !== editingTaskId
            );
          });
          // Add the task to the new swimlane based on the updated status
          newState[updatedTask.status].tasks.push(updatedTask);
          return newState;
        });
      } else {
        // Add new task
        const response = await axios.post(
          'http://127.0.0.1:8000/api/tasks/',
          JSON.stringify(taskData),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const newTask = response.data;
        console.log('Task added successfully:', newTask);
        setKanbanData((prevState) => ({
          ...prevState,
          [newTask.status]: {
            tasks: [...prevState[newTask.status].tasks, newTask],
          },
        }));
      }
      handleClose();
    } catch (error) {
      console.error(
        'Error adding/updating task:',
        error.response?.data || error
      );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DefaultLayout>
        <div className="task-manager">
          <Breadcrumb pageName="TaskManager" />
          <div className="flex flex-col gap-y-4 rounded-xl border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="pl-2 text-title-lg font-semibold text-black dark:text-white">
                Manage your Tasks
              </h3>
            </div>
            <div className="flex flex-col gap-4 2xsm:flex-row 2xsm:items-center">
              <div>
                <Button
                  variant="contained"
                  className="button button-primary"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon className="plus-icon" />}
                  onClick={handleClickOpen}
                >
                  Add Task
                </Button>

                {/* Material-UI Dialog for Add Task Form */}
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogContent>
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={Boolean(formErrors.type)}
                    >
                      <InputLabel id="task-type-label">Task Type</InputLabel>
                      <Select
                        labelId="task-type-label"
                        id="task-type"
                        value={taskDetails.type}
                        onChange={(event) => {
                          setTaskDetails({
                            ...taskDetails,
                            type: event.target.value,
                          });
                          setFormErrors({ ...formErrors, type: '' });
                        }}
                        label="Task Type"
                      >
                        <MenuItem value={'todo'}>To Do</MenuItem>
                        <MenuItem value={'inProgress'}>In Progress</MenuItem>
                        <MenuItem value={'onHold'}>On Hold</MenuItem>
                        <MenuItem value={'completed'}>Completed</MenuItem>
                      </Select>
                      <FormHelperText>{formErrors.type}</FormHelperText>
                    </FormControl>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Task Title" /* Bind value & onChange */
                      value={taskDetails.title}
                      onChange={(event) => {
                        setTaskDetails({
                          ...taskDetails,
                          title: event.target.value,
                        });
                        setFormErrors({ ...formErrors, title: '' });
                      }}
                      error={Boolean(formErrors.title)}
                      helperText={formErrors.title}
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="assigned-employee-label">
                        Assigned Employee
                      </InputLabel>
                      <Select
                        labelId="assigned-employee-label"
                        id="assigned-employee"
                        value={taskDetails.assignedEmployee}
                        onChange={(event) => {
                          setTaskDetails({
                            ...taskDetails,
                            assignedEmployee: event.target.value,
                          });
                        }}
                        label="Assigned Employee"
                      >
                        <MenuItem value="">None</MenuItem>
                        {employees
                          .filter((employee) => employee.status === 'Active')
                          .map((employee) => (
                            <MenuItem
                              key={employee.employee_id}
                              value={employee.employee_id} // Use employee ID instead of name
                            >
                              {employee.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Due Date"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={taskDetails.dueDate || ''}
                      onChange={(event) => {
                        setTaskDetails({
                          ...taskDetails,
                          dueDate: event.target.value,
                        });
                      }}
                    />
                    {taskDetails.subtasks.map((subtask, index) => (
                      <TextField
                        key={index}
                        fullWidth
                        margin="normal"
                        label="Subtask Description"
                        value={subtask.description}
                        // Ensure the event type matches the expected input type
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => handleSubtaskChange(index, event)}
                      />
                    ))}
                    <IconButton onClick={handleAddSubtask} color="primary">
                      <AddCircleOutlineIcon />
                    </IconButton>
                    {/* Dynamically add subtasks fields */}
                    <FormControl
                      component="fieldset"
                      fullWidth
                      margin="normal"
                      error={Boolean(formErrors.severity)}
                    >
                      <RadioGroup
                        value={taskDetails.severity}
                        onChange={(event) => {
                          setTaskDetails({
                            ...taskDetails,
                            severity: event.target.value,
                          });
                          setFormErrors({ ...formErrors, severity: '' });
                        }}
                      >
                        <FormControlLabel
                          value="high"
                          control={<Radio />}
                          label="High"
                        />
                        <FormControlLabel
                          value="medium"
                          control={<Radio />}
                          label="Medium"
                        />
                        <FormControlLabel
                          value="low"
                          control={<Radio />}
                          label="Low"
                        />
                      </RadioGroup>
                      <FormHelperText>{formErrors.severity}</FormHelperText>
                    </FormControl>
                    {/* Image upload input */}
                    <Button
                      variant="contained"
                      component="label" // Only valid HTML label props can be passed along with Button's own props.
                      color="primary"
                      fullWidth
                      className="button button-upload"
                      startIcon={<AddCircleOutlineIcon className="plus-icon" />}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        onChange={handleImageChange}
                        className="input-file"
                      />
                    </Button>
                    {/* Submit button */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      className="button button-primary"
                      onClick={handleAddTaskSubmit} // You should replace this with your actual submission logic
                    >
                      Add Task
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="task-manager__board">
            {Object.entries(kanbanData).map(([status, data]) => {
              console.log(
                `Swimlane Props before passing - Status: ${status}, Data: `,
                data
              );
              return (
                <SwimLane
                  key={status}
                  status={status}
                  tasks={data.tasks}
                  onMoveTask={onMoveTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              );
            })}
          </div>
        </div>
      </DefaultLayout>
    </DndProvider>
  );
};

export default TaskKanban;
