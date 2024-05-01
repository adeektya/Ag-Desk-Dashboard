import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchEmployees } from '../../pages/EmployeePage/api'; // Assuming the API functions are in a separate file
import './employeetable.css';

const EmployeeTable: React.FC = () => {
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployees();
       
        setEmployeeData(data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run effect only once

  return (
    <TableContainer component={Paper} className="col-span-12">
      <h2 className="table-heading">Employee Details</h2>
      <Table className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark" aria-label="employee table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Contact Number</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Start Date</TableCell>
            
            <TableCell>Salary</TableCell>
            
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeeData.map((employee: any) => ( // Adjust the type of 'employee' according to your data structure
            <TableRow key={employee.id} className="table-row">
              <TableCell>
                <img src={employee.image} alt={employee.name} className="employee-image" />
              </TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.contactNumber}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.start_date}</TableCell>
              
              <TableCell>{employee.salary}</TableCell>
              
              <TableCell>{employee.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;
