import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { fetchEmployees } from '../../pages/EmployeePage/api';
import './employeetable.css';
import { useFarm } from '../../contexts/FarmContext';
import { Avatar } from '@mui/material';

const EmployeeTable: React.FC = () => {
  const { activeFarm } = useFarm();
  const [employeeData, setEmployeeData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeFarm) {
          const data = await fetchEmployees(activeFarm.id);
          console.log('Fetched employee data:', data); 
          setEmployeeData(data);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchData();
  }, [activeFarm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const paginatedData = employeeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          {paginatedData.map((employee: any) => (
            <TableRow key={employee.id} className="table-row">
              <TableCell>
                <Avatar src={`http://127.0.0.1:8000${employee.photo}`} alt={employee.name} className="employee-image" />
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
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={employeeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default EmployeeTable;
