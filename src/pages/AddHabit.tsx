import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { AddTaskRounded, MicRounded, AttachFileRounded, StopRounded, UploadRounded, DeleteRounded } from "@mui/icons-material";
import { IconButton, InputAdornment, Tooltip, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Typography, Box } from "@mui/material";
import { CategorySelect, ColorPicker, TopBar, CustomEmojiPicker } from "../components";
import { UserContext } from "../contexts/UserContext";
import { useTheme } from "@emotion/react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useStorageState } from "../hooks/useStorageState";
import { Category, Task } from "../types/user";
import { generateUUID, getFontColor, isDark, showToast } from "../utils";

const AddTask = () => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Urgent & Important");
  const [status, setStatus] = useState("Pending");
  const [emailReminder, setEmailReminder] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("");
  const [pinned, setPinned] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useStorageState<Category[]>(
    [],
    "categories",
    "sessionStorage",
  );

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    document.title = "Todo App - Add Task";
  }, []);

  const handleAddTask = async () => {
    if (!auth.currentUser) {
      showToast("You must be logged in to add a task.", { type: "error" });
      return;
    }

    if (name === "") {
      showToast("Task name is required.", { type: "error" });
      return;
    }

    const userId = auth.currentUser.uid;
    const taskId = generateUUID();
    const taskRef = collection(db, "users", userId, "tasks");

    try {
      // Step 1: Upload the document and voice file to Firebase Storage
        
      const documentUrl = documentFile ? await handleFileUpload(documentFile, `tasks/${taskId}/documents/${documentFile.name}`) : null;
      const voiceFileUrl = voiceBlob ? await handleFileUpload(voiceBlob, `tasks/${taskId}/voice_notes/${voiceBlob}.mp3`) : null;

      // Step 2: Save task details to Firestore including the URLs of uploaded files
      await addDoc(taskRef, {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
        priority,
        status,
        emailReminder,
        recurrenceFrequency,
        pinned,
        documentUrl,
        voiceFileUrl,
        categories: selectedCategories, 
        createdAt: new Date(),
      });

      showToast(`Added task: ${name}`, { icon: <AddTaskRounded /> });
      navigate("/");
    } catch (error) {
      console.error("Error adding task:", error);
      showToast("Failed to add task.", { type: "error" });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] | undefined = [];


      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };


      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        setVoiceBlob(blob);
        setVoiceUrl(URL.createObjectURL(blob));
      };


      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      showToast("Recording started!", { type: "success" });
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };


  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      showToast("Voice recording stopped!", { type: "success" });
    }
  };


  const removeVoiceNote = () => {
    setVoiceBlob(null);
    setVoiceUrl(null);
    showToast("Voice note removed!", { type: "success" });
  };


  const handleFileUpload = async (file: ArrayBuffer | Blob | Uint8Array<ArrayBufferLike>, path: string | undefined) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };
  return (
    <>
      <TopBar title="Add New Task" />
      <CustomEmojiPicker emoji={undefined} setEmoji={() => {}} name={name} type="task" />
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: theme.spacing(3) }}>  
        <Box sx={{ maxWidth: "sm", display: "flex", flexDirection: "column", alignItems:"center",justifyContent: "center",padding: theme.spacing(3) }}>
          <StyledInput label="Task Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth sx={{ mb: 2, width: "100%" }} />
          <StyledInput label="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} fullWidth sx={{ mb: 2 }} />
          <StyledInput type="datetime-local" label="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} fullWidth sx={{ mb: 2 }} />

          

          {/* File Upload with Icon */}
          <StyledInput
            type="file"
            label="Attach File"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Attach File">
                    <IconButton component="label">
                      <AttachFileRounded />
                      <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Box>
            {!isRecording ? (
              <Tooltip title="Start Recording" sx={{ flex : 1 , flexDirection: "row", alignItems: "center", justifyContent: "center", padding: theme.spacing(3) }}>
                <Box sx={{ flex : 1 , flexDirection: "row", alignItems: "center", justifyContent: "center", padding: theme.spacing(3) }}> 
                <h3>Add voice recode</h3>
                <IconButton color="primary" onClick={startRecording}>
                  <MicRounded />
                </IconButton>
                </Box>
                
              </Tooltip>
            ) : (
              <Tooltip title="Stop Recording">
                <IconButton color="error" onClick={stopRecording}>
                  <StopRounded />
                </IconButton>
              </Tooltip>
            )}


            {voiceUrl && (
              <div>
                <audio controls src={voiceUrl} />
                <Tooltip title="Remove Voice">
                  <IconButton color="error" onClick={removeVoiceNote}>
                    <DeleteRounded />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </Box>
          <FormControlLabel 
            control={<Checkbox checked={emailReminder} onChange={(e) => setEmailReminder(e.target.checked)} />} 
            label="Email Reminder" 
            sx={{ mb: 2 }} 
          />

          {emailReminder && (
            <>
              

              
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Recurrence Frequency</InputLabel>
                  <Select value={recurrenceFrequency} onChange={(e) => setRecurrenceFrequency(e.target.value)}>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              
            </>
          )}
          {/* <FormControlLabel control={<Checkbox checked={pinned} onChange={(e) => setPinned(e.target.checked)} />} label="Pin Task" sx={{ mb: 2 }} /> */}
        </Box>
        <Box sx={{ maxWidth: "sm", display: "flex", flexDirection: "column", alignItems:"center",justifyContent: "center",pr: 13 , pl: 13  }}> 
          <FormControl fullWidth sx={{ mb: 2, width: "100%" ,pr: 13 , pl: 13}}>
            <h4>Priority</h4>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <MenuItem value="Urgent & Important">Urgent & Important</MenuItem>
              <MenuItem value="Urgent & Not Important">Urgent & Not Important</MenuItem>
              <MenuItem value="Not Urgent & Important">Not Urgent & Important</MenuItem>
              <MenuItem value="Not Urgent & Not Important">Not Urgent & Not Important</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2, width: "100%" , pr: 13 , pl: 13}}>
            <h4>Status</h4>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <CategorySelect
            selectedCategories={selectedCategories}
            onCategoryChange={(categories) => setSelectedCategories(categories)}
            fontColor={getFontColor(theme.secondary)}
            
          />
          </Box>  
        <AddTaskButton onClick={handleAddTask}>Create Task</AddTaskButton>
     </Container> 
    </>
  );
};

export default AddTask;
