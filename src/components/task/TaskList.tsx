import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onEdit, onDelete, title }: any) => {
    const colors = ['#FFEA28', '#3AE836', '#B624FF', '#7ACCFA']; // Array of colors

  return (
    <Box sx={{ pr: 5, pl: 5}}>
      {/* Use the title prop here */}
      <Typography variant="h6" sx={{ mb: 2, alignItems: "center" }}>
        {title}
      </Typography>

      {tasks.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {tasks.map((task: any, index: number) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              color={colors[index % colors.length]} // Assign color
            />
          ))}
        </Box>
      ) : (
        <Typography>No tasks available.</Typography>
      )}
    </Box>
  );
};

export default TaskList;
