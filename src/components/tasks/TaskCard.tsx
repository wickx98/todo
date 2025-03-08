// components/TaskCard.tsx
import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const TaskCard = ({ task, onEdit, onDelete }: { task: any, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
  return (
    <Card sx={{ minWidth: 275, maxWidth: 345, flexGrow: 1, transition: "transform 0.2s", '&:hover': { transform: "scale(1.05)" } }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
          {task.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Priority:</strong> {task.priority}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Status:</strong> {task.status}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Description:</strong> {task.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Created At:</strong> {task.createdAt?.toDate().toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Deadline:</strong> {task.deadline?.toDate().toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Categories:</strong> {task.categories?.map((category: any) => `${category.name} (Color: ${category.color})`).join(", ")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Email Reminder:</strong> {task.emailReminder ? "Enabled" : "Disabled"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Pinned:</strong> {task.pinned ? "Yes" : "No"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Recurring:</strong> {task.recurring ? "Yes" : "No"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Voice File:</strong> {task.voiceFileUrl ? <a href={task.voiceFileUrl} target="_blank" rel="noopener noreferrer">Play Voice</a> : "No Voice File"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Document URL:</strong> {task.documentUrl ? <a href={task.documentUrl} target="_blank" rel="noopener noreferrer">View Document</a> : "No Document"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(task.id)}>Edit</Button>
        <Button size="small" color="error" onClick={() => onDelete(task.id)}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
