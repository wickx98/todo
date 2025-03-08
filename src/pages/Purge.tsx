import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { AddButton, GreetingHeader, GreetingText } from "../styles";
import { UserContext } from '../contexts/UserContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useResponsiveDisplay } from '../hooks/useResponsiveDisplay';
import TaskList from '../components/task/TaskList';
import { Emoji } from 'emoji-picker-react';
import { AddRounded, WifiOff } from '@mui/icons-material';
import { Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { deleteDoc } from 'firebase/firestore';

const TaskDetails = () => {
  const { user } = useContext(UserContext);
  const { emojisStyle, settings, name } = user;
  const [tasks, setTasks] = useState([]); 
  const [randomGreeting, setRandomGreeting] = useState<string | React.ReactNode>("");
  const [greetingKey, setGreetingKey] = useState<number>(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const isOnline = useOnlineStatus();
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const db = getFirestore();
      const tasksRef = collection(db, `users/${currentUser.uid}/tasks`);

      const fetchTasks = async () => {
        try {
          const querySnapshot = await getDocs(tasksRef);

          // Exclude tasks with status "Deleted"
          const filteredTasks = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((task) => task.status == "Deleted");

          setTasks(filteredTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };

      fetchTasks();
    }
  }, []);

  // Function to mark a task as "Deleted"
  const handleDeleteTask = async (id: string) => {
    try {
      const db = getFirestore();
      const taskDocRef = doc(db, `users/${getAuth().currentUser?.uid}/tasks`, id);
  
      // Delete the task from Firestore
      await deleteDoc(taskDocRef);
  
      // Update state to remove the deleted task from display
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  
      // Show success toast notification
      toast.success("Task deleted successfully!", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      setOpenDeleteDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error deleting task:", error);
  
      // Show error toast notification
      toast.error("Failed to delete task!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  

  // Open delete confirmation dialog
  const handleDeleteConfirmation = (id: string) => {
    setTaskToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setTaskToDelete(null);
  };

  // Greeting function
  const displayGreeting = (): string => {
    const currentHour = new Date().getHours();
    if (currentHour < 12 && currentHour >= 5) return "Good morning";
    if (currentHour < 18 && currentHour > 12) return "Good afternoon";
    return "Good evening";
  };

  // Render greeting with emojis
  const renderGreetingWithEmojis = (text: string | React.ReactNode) => {
    if (typeof text === "string") {
      const emojiRegex = /\*\*(.*?)\*\*/g;
      return text.split(emojiRegex).map((part, index) =>
        index % 2 === 1 ? <Emoji key={index} size={20} unified={part.trim()} emojiStyle={emojisStyle} /> : part
      );
    } else {
      return text;
    }
  };

  return (
    <>
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={emojisStyle} /> &nbsp; {displayGreeting()}
        {name && (
          <span translate="no">
            , <span>{name}</span>
          </span>
        )}
      </GreetingHeader>
      <GreetingText key={greetingKey}>{renderGreetingWithEmojis(randomGreeting)}</GreetingText>

      {!isOnline && (
        <div>
          <WifiOff /> You're offline but you can use the app!
        </div>
      )}

      <TaskList
        tasks={tasks}
        onEdit={(id) => n(`/edit/${id}`)}
        onDelete={handleDeleteConfirmation} // Pass confirmation handler
        title="Trash bin"
      />
      
     

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button
            onClick={() => {
              if (taskToDelete) handleDeleteTask(taskToDelete);
            }}
            color="secondary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskDetails;
