import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { AddTaskRounded } from "@mui/icons-material";
import { FormControl, Box } from "@mui/material";
import { CategorySelect, TopBar, CustomEmojiPicker } from "../components";
import { UserContext } from "../contexts/UserContext";
import { useTheme } from "@emotion/react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { generateUUID, getFontColor, showToast } from "../utils";

const AddHabit = () => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [startTime, setStartTime] = useState(""); // New state for start time
  const [duration, setDuration] = useState(""); // New state for duration

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    document.title = "Habit Tracker - Add Habit";
  }, []);

  const handleAddHabit = async () => {
    if (!auth.currentUser) {
      showToast("You must be logged in to add a habit.", { type: "error" });
      return;
    }

    if (name === "") {
      showToast("Habit name is required.", { type: "error" });
      return;
    }

    if (!startTime) {
      showToast("Start time is required.", { type: "error" });
      return;
    }

    if (!duration) {
      showToast("Duration is required.", { type: "error" });
      return;
    }

    const userId = auth.currentUser.uid;
    const habitId = generateUUID();
    const habitRef = collection(db, "users", userId, "habits");

    try {
      await addDoc(habitRef, {
        name,
        description,
        category,
        startTime,
        duration, // Save duration to Firestore
        createdAt: new Date(),
      });

      showToast(`Added habit: ${name}`, { icon: <AddTaskRounded /> });
      navigate("/");
    } catch (error) {
      console.error("Error adding habit:", error);
      showToast("Failed to add habit.", { type: "error" });
    }
  };

  return (
    <>
      <TopBar title="Add New Habit" />
      <CustomEmojiPicker emoji={undefined} setEmoji={() => {}} name={name} type="habit" />
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: theme.spacing(3) }}>
        <Box sx={{ maxWidth: "sm", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: theme.spacing(3) }}>
          <StyledInput
            label="Habit Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2, width: "100%" }}
          />
          <StyledInput
            label="Habit Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
          {/* Start Time Input */}
          <StyledInput
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {/* Duration Input */}
          <StyledInput
            label="Duration (in minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
        </Box>
        <Box sx={{ maxWidth: "sm", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pr: 13, pl: 13 }}>
          <FormControl fullWidth sx={{ mb: 2, width: "100%", pr: 13, pl: 13 }}>
            <CategorySelect
              selectedCategories={category ? [category] : []}
              onCategoryChange={(categories) =>
                setCategory(categories.length > 0 ? categories[0].name : "")
              }
              fontColor={getFontColor(theme.secondary)}
            />
          </FormControl>
        </Box>
        <AddTaskButton onClick={handleAddHabit}>Create Habit</AddTaskButton>
      </Container>
    </>
  );
};

export default AddHabit;
