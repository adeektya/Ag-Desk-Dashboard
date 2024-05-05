// ApprovalTable.tsx
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const ApprovalTable = ({ unapprovedUsers, handleApproval }) => {
  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            onClick={() => handleApproval(params.id, true)}
          >
            Approve
          </Button>
          <Button
            color="secondary"
            onClick={() => handleApproval(params.id, false)}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={unapprovedUsers}
        columns={columns}
        pagination
        autoPageSize
        checkboxSelection={false}
      />
    </div>
  );
};

export default ApprovalTable;
