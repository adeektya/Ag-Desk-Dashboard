import axios from "axios";

export const API_URL = 'http://127.0.0.1:8000/employee/employees/';
export const USER_API_URL = 'http://127.0.0.1:8000/user/generate-code/';

export const generateInvitationCode = async () => {
  const token = localStorage.getItem('token'); // Get the auth token from storage
  try {
    const response = await axios.post(
      `${USER_API_URL}`,
      {},
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    return response.data.code; // Assuming the response will include the code
  } catch (error) {
    console.error('Error generating invitation code:', error);
    throw error;
  }
};

export const fetchEmployees = async (farmId) => {
  try {
    const response = await fetch(`${API_URL}?farm=${farmId}`);
    if (!response.ok) throw new Error('Network response was not ok.');
    console.log('Response:', response);
    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const createEmployee = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== '') {
        // Map startDate to start_date
        const fieldName = key === 'startDate' ? 'start_date' : key;
        formData.append(fieldName, data[key]);
      }
    });

    // Log FormData entries before sending
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages = Object.keys(responseData).map(
        (key) => `${key}: ${responseData[key].join(', ')}`
      );
      console.error('Error creating employee:', errorMessages);
      throw new Error(
        `Failed to create employee: ${JSON.stringify(responseData)}`
      );
    }

    return responseData;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

export const updateEmployee = async (employeeId, data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== '') {
        if (key === 'photo' && data[key] instanceof File) {
          formData.append(key, data[key]);
        } else if (key !== 'photo') {
          const fieldName = key === 'startDate' ? 'start_date' : key;
          formData.append(fieldName, data[key]);
        }
      }
    });

    const response = await fetch(`${API_URL}${employeeId}/`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const responseData = await response.json();
      const errorMessages = Object.keys(responseData).map(
        (key) => `${key}: ${responseData[key].join(', ')}`
      );
      console.error('Error updating employee:', errorMessages);
      throw new Error(
        `Failed to update employee: ${JSON.stringify(responseData)}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${API_URL}${employeeId}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error('Error deleting employee:', responseData);
      throw new Error(
        `Failed to delete employee: ${JSON.stringify(responseData)}`
      );
    }

    return {};
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};
