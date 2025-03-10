import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { AddButton, GreetingHeader, GreetingText } from "../styles";
import { UserContext } from '../contexts/UserContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useResponsiveDisplay } from '../hooks/useResponsiveDisplay';
import HabitList from '../components/habit/HabitList';
import { Emoji } from 'emoji-picker-react';
import { AddRounded, WifiOff } from '@mui/icons-material';
import { Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const HabitDetails = () => {
  const { user } = useContext(UserContext);
  const { emojisStyle, settings, name } = user;
  const [habits, setHabits] = useState([]); 
  const [categories, setCategories] = useState({});
  const [randomGreeting, setRandomGreeting] = useState<string | React.ReactNode>("");
  const [greetingKey, setGreetingKey] = useState<number>(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const isOnline = useOnlineStatus();
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const db = getFirestore();
      const habitsRef = collection(db, `users/${currentUser.uid}/habits`);

      const fetchHabits = async () => {
        try {
          const querySnapshot = await getDocs(habitsRef);
          const categorizedHabits = {};

          querySnapshot.docs.forEach((doc) => {
            const habit = { id: doc.id, ...doc.data() };
            if (habit.status !== "Deleted") {
              const category = habit.category || "Uncategorized";
              if (!categorizedHabits[category]) {
                categorizedHabits[category] = [];
              }
              categorizedHabits[category].push(habit);
            }
          });

          setCategories(categorizedHabits);
        } catch (error) {
          console.error("Error fetching habits:", error);
        }
      };

      fetchHabits();
    }
  }, []);

  const handleDeleteHabit = async (id: string) => {
    try {
      const db = getFirestore();
      const habitDocRef = doc(db, `users/${getAuth().currentUser?.uid}/habits`, id);
      await updateDoc(habitDocRef, { status: "Deleted" });
      setCategories((prevCategories) => {
        const updatedCategories = { ...prevCategories };
        for (const category in updatedCategories) {
          updatedCategories[category] = updatedCategories[category].filter((habit) => habit.id !== id);
        }
        return updatedCategories;
      });
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error updating habit status:", error);
    }
  };

  const handleDeleteConfirmation = (id: string) => {
    setHabitToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setHabitToDelete(null);
  };

  return (
    <>
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={emojisStyle} /> &nbsp; Hello, {name}
      </GreetingHeader>
      <GreetingText key={greetingKey}>{randomGreeting}</GreetingText>

      {!isOnline && (
        <div>
          <WifiOff /> You're offline but you can use the app!
        </div>
      )}

      {Object.keys(categories).map((category) => (
        <HabitList
          key={category}
          habits={categories[category]}
          category={category}
          onEdit={(id) => n(`/edit/${id}`)}
          onDelete={handleDeleteConfirmation}
          title={category}
        />
      ))}
      
      {!isMobile && (
        <Tooltip title="Add New Habit" placement="left">
          <AddButton onClick={() => n("add-habit")} aria-label="Add Habit">
            <AddRounded style={{ fontSize: "44px" }} />
          </AddButton>
        </Tooltip>
      )}

      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this habit?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button
            onClick={() => {
              if (habitToDelete) handleDeleteHabit(habitToDelete);
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

export default HabitDetails;
