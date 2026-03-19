import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

const PRIORITY_CONFIG = {
  P1: { label: 'P1 – High',   color: '#f44336' },
  P2: { label: 'P2 – Medium', color: '#ff9800' },
  P3: { label: 'P3 – Low',    color: '#4caf50' },
};

function TaskForm({ onSave, initialTask }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [dueDate, setDueDate] = useState(initialTask?.due_date || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'P3');
  const [error, setError] = useState(null);

  // Helper to normalize date string to YYYY-MM-DD format
  const normalizeDateString = (dateString) => {
    if (!dateString) return '';
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Otherwise, parse and format
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update form fields when initialTask changes (editing mode)
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setDueDate(normalizeDateString(initialTask.due_date));
      setPriority(initialTask.priority || 'P3');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('P3');
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError(null);
    await onSave({ title, description, due_date: dueDate, priority });
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('P3');
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600,
          color: '#1976d2',
          mb: 1.5
        }}
      >
        {initialTask ? 'Edit Task' : 'Add Task'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={1.5}>
        <TextField
          id="task-title"
          label="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          variant="outlined"
          fullWidth
          size="small"
          inputProps={{ 'data-testid': 'title-input' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              }
            }
          }}
        />
        <TextField
          id="task-description"
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          minRows={2}
          variant="outlined"
          fullWidth
          size="small"
          inputProps={{ 'data-testid': 'description-input' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              }
            }
          }}
        />
        <Box display="flex" gap={1.5}>
          <TextField
            id="task-due-date"
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'data-testid': 'due-date-input' }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
              }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="task-priority-label" shrink>Priority</InputLabel>
            <Select
              labelId="task-priority-label"
              id="task-priority"
              value={priority}
              label="Priority"
              onChange={e => setPriority(e.target.value)}
              inputProps={{ 'data-testid': 'priority-select' }}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: PRIORITY_CONFIG[priority]?.color,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: PRIORITY_CONFIG[priority]?.color,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: PRIORITY_CONFIG[priority]?.color,
                },
                '& .MuiSelect-select': {
                  color: PRIORITY_CONFIG[priority]?.color,
                  fontWeight: 700,
                }
              }}
            >
              {Object.entries(PRIORITY_CONFIG).map(([value, { label, color }]) => (
                <MenuItem key={value} value={value} sx={{ color, fontWeight: 700 }}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {error && <Typography color="error" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{error}</Typography>}
        <Box display="flex" gap={2}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth
            data-testid="submit-task"
            startIcon={initialTask ? <SaveIcon /> : <AddIcon />}
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
            }}
          >
            {initialTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default TaskForm;
