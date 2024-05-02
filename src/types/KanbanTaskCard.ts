export interface Subtask {
    id: number;  // Make sure to include 'id' if it's used in the implementation.
    description: string;
    completed: boolean;
  }
  
  export interface Task {
    id: number;
    title: string;
    severity: string;
    image?: string;
    subtasks: Subtask[];
    status: string;
    assigned_employee?: string;
    assigned_employee_name?: string;
    due_date?: string;
  }