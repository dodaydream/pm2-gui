// components/CreateDatabaseModal.tsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export interface CreateDatabaseModalRef {
  openModal: () => void;
  closeModal: () => void;
}

export const CreateDatabaseModal = forwardRef<CreateDatabaseModalRef>(
  ({}, ref) => {
    const [open, setOpen] = useState(false);
    const [dbName, setDbName] = useState('');
    const [description, setDescription] = useState('');

    useImperativeHandle(ref, () => ({
      openModal: () => setOpen(true),
      closeModal: () => setOpen(false),
    }));

    const handleSubmit = () => {
      if (!dbName) return;
      // onSubmit(dbName, description);
      setDbName('');
      setDescription('');
      setOpen(false);
    };

    return (
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create a new database</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Database Name"
            fullWidth
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    );
  },
);
