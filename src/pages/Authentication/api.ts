import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/';

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${baseURL}user/register/`, {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      is_owner: userData.is_owner,
      is_employee: userData.is_employee,
      invitation_code: userData.invitation_code,
    });

    return response.data;
  } catch (error) {
    console.error(
      'Registration error:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${baseURL}user/login/`, userData); // Remove the extra slash
    return response.data; // Returns data directly for simplicity
  } catch (error) {
    console.error(
      'Login error:',
      error.response ? error.response.data : error.message
    );
    throw error; // Re-throw the error to handle it in the calling function
  }
};
export const registerEmployee = async (employeeData: any) => {
  try {
    const response = await axios.post(
      `${baseURL}user/employee-register/`,
      employeeData
    );
    return response.data;
  } catch (error) {
    console.error(
      'Employee registration error:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
