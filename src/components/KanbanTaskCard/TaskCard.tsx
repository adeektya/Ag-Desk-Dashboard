import React from 'react';
import DropdownDefault from '../Dropdowns/DropdownDefault';
import { useDrag } from 'react-dnd';
import './taskcard.css';

interface Subtask {
  id: number;
  description: string;
  completed: boolean;
}

interface TaskCardProps {
  id: number;
  title: string;
  subtasks: Subtask[];
  severity?: string; // Marked as optional or check for undefined
  image?: string;
  status: string; // Make sure this is being passed to the component
  assignedEmployee?: string;
  assigned_employee_name?: string; // Check for this prop
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => Promise<void>;
  dueDate?: string; // Add a dueDate prop
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  subtasks = [],
  severity,
  image,
  status,
  assignedEmployee,
  assigned_employee_name,
  onEdit,
  onDelete,
  dueDate,
}) => {
  console.log('TaskCard Props:', {
    id,
    title,
    subtasks,
    severity,
    image,
    status,
    assignedEmployee,
    dueDate
  });
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'TASK',
      item: { id, title, taskStatus: status || 'unknown', severity },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, title, status, severity]
  );

  const getSeverityClass = (severity: string) => {
    switch (
      severity?.toLowerCase()
    ) {
      case 'high':
        return 'task-card__severity--high';
      case 'medium':
        return 'task-card__severity--medium';
      case 'low':
        return 'task-card__severity--low';
      default:
        return '';
    }
  };

  return (
    <div
      ref={drag}
      draggable="true"
      className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
    >
      <div className="task-card__header">
        <div className="task-card__left">
          <div className="task-card__dropdown">
            <DropdownDefault
              onEdit={() => onEdit(id)}
              onDelete={() => onDelete(id)}
            />
          </div>
          <h3 className="task-card__title">{title}</h3>
        </div>
        <span
          className={`task-card__severity task-card__severity--${severity}`}
        >
          {severity}
        </span>
      </div>
      {image && (
        <div className="task-card__image">
          <img src={image} alt="Task" />
        </div>
      )}
      <div className="task-card__subtasks">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="task-card__subtask">
            <label
              htmlFor={`taskCheckbox-${id}-${subtask.id}`}
              className="task-card__subtask-label"
            >
              <input
                type="checkbox"
                id={`taskCheckbox-${id}-${subtask.id}`}
                className="task-card__subtask-checkbox"
                defaultChecked={subtask.completed}
              />
              <span className="task-card__subtask-text">
                {subtask.description}
              </span>
            </label>
          </div>
        ))}
      </div>
      {assignedEmployee && (
        <div className="task-card__assigned-employee">
          <div className="task-card__assigned-employee-label">Assigned to:</div>
          <div className="task-card__assigned-employee-name">
            {assigned_employee_name}
          </div>
        </div>
      )}
      {dueDate && (
        <div className="task-card__due-date">
          Due: {new Date(dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
