import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from '../KanbanTaskCard/TaskCard';
import axios from 'axios';
import { Task, Subtask } from '../../types/KanbanTaskCard';
import './swimlane.css';
import {
  PlayCircleOutline,
  PauseCircleOutline,
  CheckCircleOutline,
} from '@mui/icons-material';
import ConstructionIcon from '@mui/icons-material/Construction';

// Define the DraggableItem interface
interface DraggableItem {
  taskStatus: string;
  id: number;
  title: string;
  status: string; // Include the current status of the task
}

interface SwimLaneProps {
  status: string;
  tasks: Task[];
  onMoveTask: (taskId: number, newStatus: string) => void;
  onEditTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => Promise<void>;
}

const SwimLane: React.FC<SwimLaneProps> = ({
  status,
  tasks,
  onMoveTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [, dropRef] = useDrop({
    accept: 'TASK',
    drop: (item: DraggableItem) => {
      console.log(
        `Attempt to drop: ${item.title} from ${item.taskStatus} to ${status}`
      );
      if (item.taskStatus !== status) {
        onMoveTask(item.id, status);
      }
    },
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo':
        return <ConstructionIcon className="swim-lane__status-icon" />;
      case 'inProgress':
        return <PlayCircleOutline className="swim-lane__status-icon" />;
      case 'onHold':
        return <PauseCircleOutline className="swim-lane__status-icon" />;
      case 'completed':
        return <CheckCircleOutline className="swim-lane__status-icon" />;
      default:
        return null;
    }
  };

  // Log the canDrop and isOver states for debugging

  return (
    <div ref={dropRef} className="swim-lane flex flex-col gap-5.5">
      <h4 className="swim-lane__title">
        <span className="swim-lane__status-icon">{getStatusIcon(status)}</span>
        {status} ({tasks.length})
      </h4>
      <div className="swim-lane__tasks">
        {tasks.map((task, index) => {
          console.log(" task data right before it's passed to the TaskCard in SwimLane", {
            ...task,
            assignedEmployee: task.assigned_employee,
          });
          return (
            <TaskCard
              key={`${task.status}-${task.id}`}
              {...task}
              assignedEmployee={task.assigned_employee}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              dueDate={task.due_date}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SwimLane;
