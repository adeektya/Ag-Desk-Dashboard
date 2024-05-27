import axios from 'axios';
import BASE_URL from '../../../config'; 

export const registerUser = async (userData: any) => {
  // Basic client-side validation (Example: Check for empty fields)
  if (!userData.username || !userData.email || !userData.password || !userData.invitation_code) {
    throw new Error("Please fill in all fields including the invitation code.");
  }

  try {
    const response = await axios.post(`${BASE_URL}/user/register/`, {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      is_owner: userData.is_owner,
      is_employee: userData.is_employee,
      invitation_code: userData.invitation_code,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('Registration error:', error.response.data);
      throw new Error(error.response.data.detail || "Registration failed. Please try again.");
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Registration error: No response received');
      throw new Error("No response from the server. Please check your network connection.");
    } else {
      // Something happened in setting up the request and triggered an Error
      console.error('Registration error:', error.message);
      throw new Error("An error occurred during registration. Please try again.");
    }
  }
};

export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login/`, userData); // Remove the extra slash
    return response.data; // Returns data directly for simplicity
  } catch (error) {
    console.error(
      'Login error:',
      error.response ? error.response.data : error.message
    );
    throw error; // Re-throw the error to handle it in the calling function
  }
};