# AG-DESK: Farm Management Dashboard

## Project Overview

AG-DESK is a comprehensive farm management dashboard designed to streamline and simplify the day-to-day activities of farm owners and employees. The application includes modules for task management, employee management, inventory management, calendar events, and more. By integrating these functionalities into a single platform, AG-DESK helps users efficiently manage their farm operations and improve productivity.

### Project Objectives

- **Simplify Farm Management**: Provide a centralized platform to manage various farm activities.
- **Enhance Productivity**: Streamline task assignment and tracking for employees.
- **Improve Inventory Management**: Keep track of inventory levels and manage supplies effectively.
- **Facilitate Communication**: Enhance communication and coordination among farm staff.

### Methodology

The project was developed using the Agile Scrum methodology. We conducted fortnightly sprint meetings to update progress, gather feedback, and make necessary adjustments. Notion was used to keep clients updated on the project's status and to document progress.

### Techniques Applied

- **Frontend**: Developed using React, Vite, and TypeScript.
- **Backend**: Implemented using Django, including Django REST Framework for API creation.
- **Project Management**: Agile Scrum methodology with sprint meetings and client updates through Notion.
- **Authentication**: Secure user authentication for farm owners and employees using invite codes.

## Usage Instructions

### Backend Setup

1. **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # For Unix/macOS
    venv\Scripts\activate  # For Windows
    ```

2. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3. **Apply migrations**:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

4. **Run the server**:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Run the development server**:
    ```bash
    npm run dev
    ```

## Final Results

AG-DESK provides a user-friendly tool for farm owners and employees to manage their daily operations effectively. The dashboard includes features such as:

- **Task Manager**: Assign and track tasks for farm employees.
- **Employee Management**: Manage employee information and roles.
- **Inventory Management**: Monitor and manage farm inventory.
- **Calendar Events**: Schedule and track important events and activities.
- **Weather Visualization**: Stay updated with weather information relevant to the farm.

### Authentication

AG-DESK ensures secure access to the platform by using invite codes for user registration. Farm owners can generate invite codes for their employees, ensuring that only authorized personnel have access to the dashboard.

### Dashboard

The AG-DESK dashboard provides an intuitive interface for visualizing farm data, managing tasks, and monitoring inventory and weather conditions. This tool significantly enhances the efficiency of farm management operations, making it easier for farm owners and employees to collaborate and stay organized.

---

We hope AG-DESK serves as a valuable tool in optimizing your farm management practices. For any further assistance or feedback, please feel free to contact us.
