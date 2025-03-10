import React from 'react';
import { Box, Typography } from '@mui/material';
import HabitCard from './HabitCard';

const HabitList = ({ habits, onEdit, onDelete, category }: any) => {
  const colors = ['#FFEA28', '#3AE836', '#B624FF', '#7ACCFA'];

  return (
    <Box sx={{ pr: 5, pl: 5, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, alignItems: "center" }}>
        {category}
      </Typography>

      {habits.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {habits.map((habit: any, index: number) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={onEdit}
              onDelete={onDelete}
              color={colors[index % colors.length]}
            />
          ))}
        </Box>
      ) : (
        <Typography>No habits available in this category.</Typography>
      )}
    </Box>
  );
};

export default HabitList;
