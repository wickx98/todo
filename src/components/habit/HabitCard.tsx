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

const statusColors = {
  Pending: 'red',
  'In Progress': 'orange',
  Completed: 'green',
};

const HabitCard = ({
  habit,
  onEdit,
  onDelete,
  color,
}: {
  habit: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  color: string;
}) => {
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
          boxShadow: `0 0 15px 10px ${color}`,
        },
        backgroundColor: color,
        border: '4px solid transparent',
        borderColor: color,
        boxShadow: '0 0 0 4px transparent',
        position: 'relative',
        maxHeight: '250px',
        borderRadius: '20px',
      }}
    >
      

      <CardContent>
        <Typography variant="h5" component="div" sx={{ color: 'black' }}>
          {habit.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'black' }}>
            {habit.description}
          </Typography>
        </Box>

        {habit.voiceFileUrl && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <VoiceFileIcon sx={{ mr: 1, color: 'black' }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlayVoice}
              size="small"
              sx={{ borderRadius: '20px' }}
            >
              {isPlaying ? 'Pause Voice' : 'Play Voice'}
            </Button>
            <audio ref={audioRef} src={habit.voiceFileUrl} />
          </Box>
        )}

        {habit.documentUrl && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <DocumentIcon sx={{ mr: 1, color: 'black' }} />
            <Typography variant="body2" sx={{ color: 'black' }}>
              <a href={habit.documentUrl} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {habit.categories?.map((category: any, index: number) => (
            <Chip key={index} label={category.name} color="primary" sx={{ borderRadius: 2 }} />
          ))}
        </Box>

        <CardActions sx={{ justifyContent: 'right' }}>
          
          <Button size="small" color="error" onClick={() => onDelete(habit.id)}>Delete</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
