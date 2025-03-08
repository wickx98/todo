import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, Chip } from '@mui/material';
import {
  PriorityHigh as PriorityIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  VolumeUp as VoiceFileIcon,
  InsertDriveFile as DocumentIcon,
} from '@mui/icons-material';

// Status dot color mapping
const statusColors = {
  Pending: 'red',
  'In Progress': 'orange',
  Completed: 'green',
};

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  color,
}: {
  task: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  color: string; // Accept color as a prop
}) => {
  const formattedDeadline = task.deadline
    ? task.deadline.toDate().toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    : 'No Deadline';

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlayVoice = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card
        sx={{
            flexGrow: 1,
            transition: 'transform 0.2s, box-shadow 0.3s',
            '&:hover': { 
            transform: 'scale(1.05)',
            boxShadow: `0 0 15px 10px ${color}` // Spreads the border color outside on hover
            },
            backgroundColor: color,
            border: '4px solid transparent',    
            borderColor: color,
            boxShadow: '0 0 0 4px transparent', // No initial spread, just a border
            position: 'relative',
            maxHeight: '250px',
            borderRadius: '20px',
        }}
        >
      {/* Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px', // Add padding around the status
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Background for readability
          borderRadius: '12px',
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: statusColors[task.status] || 'gray',
            mr: 1,
          }}
        />
        <Typography variant="body2" sx={{ color: 'black' }}>
          {task.status}
        </Typography>
      </Box>

      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Task Name */}
          <Typography variant="h5" component="div" sx={{ color: 'black' }}>
            {task.name}
          </Typography>

          {/* Deadline on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Typography variant="body2" sx={{ color: 'red' }}>
              {formattedDeadline}
            </Typography>
          </Box>

          {/* Task Description */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'black' }}>
              {task.description}
            </Typography>
          </Box>
        </Box>

        {/* Voice File and Document URL (left-middle row) */}
        
          <Box sx={{ display: 'flex', alignItems: 'center' ,color: 'black' ,mt: 1 }}>
            <VoiceFileIcon sx={{ mr: 1, color: 'black' }} />
            {task.voiceFileUrl ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlayVoice}
                  size="small"
                  sx={{
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    paddingTop: '1px',
                    paddingBottom: '1px',
                    borderRadius: '20px',
                  }}
                >
                  {isPlaying ? 'Pause Voice' : 'Play Voice'}
                </Button>
                <audio ref={audioRef} src={task.voiceFileUrl} />
              </>
            ) : (
              'No Voice File'
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' ,mr: 20 ,mt: 1}}>
            <DocumentIcon sx={{ mr: 1 , color: 'black' }} />
            <Typography variant="body2" sx={{ color: 'black' }}>
              {task.documentUrl ? (
                <a href={task.documentUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              ) : (
                'No Document'
              )}
            </Typography>
          </Box>
        

        {/* Categories */}
        <Box sx={{ display: 'flex', flexDirection: 'column' , mt: 1}}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {task.categories?.map((category: any, index: number) => (
              <Chip
                key={index}
                label={category.name}
                color="primary"
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>
        </Box>
        <CardActions sx={{ justifyContent: 'space-between' }}>
            <Button size="small" onClick={() => onEdit(task.id)}>Edit</Button>
            <Button size="small" color="error" onClick={() => onDelete(task.id)}>Delete</Button>
      </CardActions>
      </CardContent>

      {/* Action Buttons */}
      
    </Card>
  );
};

export default TaskCard;
