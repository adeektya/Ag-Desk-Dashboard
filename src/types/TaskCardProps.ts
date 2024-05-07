export interface TaskCardProps {
    title: string;
    tasks: Task[];
    taskIndex: number;
    status : string;
    severity: 'high' | 'medium' | 'low';
    toggleTaskCompletion: (taskId: string) => void; 
    description?: string;
    checked?: boolean;
  }
  
  export interface Task {
    id: string;
    title: string;
    status : string;
    completed: boolean;
    subtasks: string[];
    severity: 'high' | 'medium' | 'low';
  }
