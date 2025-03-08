import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, StyledInput } from "../styles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import { showToast } from "../utils";
import { 
  Select, MenuItem, FormControl, InputLabel, 
  Button, IconButton, Tooltip, Checkbox, FormControlLabel 
} from "@mui/material";
import { AttachFileRounded, MicRounded, StopRounded, DeleteRounded } from "@mui/icons-material";
import { Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CategorySelect } from "../components"; 
import { useStorageState } from "../hooks/useStorageState";

const EditTask = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    deadline: "",
    priority: "",
    status: "",
    emailReminder: false,
    recurring: false,
    recurrenceFrequency: "",
    documentUrl: "",
    voiceFileUrl: "",
    categories: [],
    status: ""
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCategories, setSelectedCategories] = useStorageState([], "categories", "sessionStorage");

  useEffect(() => {
    if (!id) {
      console.error("Task ID is missing in the URL.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        showToast("You must be logged in to edit a task.", { type: "error" });
        navigate("/");
        return;
      }

      console.log("Fetching task data for ID:", id);
      try {
        const taskRef = doc(db, `users/${currentUser.uid}/tasks`, id);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          const data = taskSnap.data();
          setTaskData({
            ...data,
            deadline: data.deadline ? data.deadline.toDate().toISOString().slice(0, 16) : "",
          });
          setVoiceUrl(data.voiceFileUrl || null);
        } else {
          showToast("Task not found", { type: "error" });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        showToast("Failed to load task data.", { type: "error" });
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate, id]);

  // Handle File Upload
  const handleFileUpload = async (file: File | Blob, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Handle Task Update
  const handleUpdateTask = async () => {
    if (!auth.currentUser) {
      showToast("You must be logged in to edit a task.", { type: "error" });
      return;
    }

    try {
      const taskRef = doc(db, `users/${auth.currentUser.uid}/tasks`, id);
      let updatedTask = { ...taskData, deadline: taskData.deadline ? Timestamp.fromDate(new Date(taskData.deadline)) : null };

      if (documentFile) {
        updatedTask.documentUrl = await handleFileUpload(documentFile, `tasks/${id}/documents/${documentFile.name}`);
      }

      if (voiceBlob) {
        updatedTask.voiceFileUrl = await handleFileUpload(voiceBlob, `tasks/${id}/voice_notes/${id}.mp3`);
      }

      await updateDoc(taskRef, updatedTask);
      showToast("Task updated successfully!", { type: "success" });
      navigate("/");
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("Failed to update task.", { type: "error" });
    }
  };

  // Handle Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

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

  return (
    <Container>
      <h2>Edit Task</h2>

      <StyledInput label="Task Name" value={taskData.name} onChange={(e) => setTaskData({ ...taskData, name: e.target.value })} fullWidth required />

      <StyledInput label="Task Description" value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} multiline rows={4} fullWidth />

      <StyledInput type="datetime-local" label="Deadline" value={taskData.deadline} onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })} fullWidth />

      <FormControl fullWidth>
        <InputLabel>Priority</InputLabel>
        <Select value={taskData.priority} onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}>
          <MenuItem value="Urgent & Important">Urgent & Important</MenuItem>
          <MenuItem value="Urgent & Not Important">Urgent & Not Important</MenuItem>
          <MenuItem value="Not Urgent & Important">Not Urgent & Important</MenuItem>
          <MenuItem value="Not Urgent & Not Important">Not Urgent & Not Important</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2, width: "100%" , pr: 13 , pl: 13}}>
        <h4>Status</h4>
        <Select value={taskData.status} onChange={(e) => setTaskData({...taskData, status:e.target.value})}>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <StyledInput type="file" label="Attach File" onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} fullWidth />

      {!isRecording ? (
        <Tooltip title="Start Recording">
          <IconButton color="primary" onClick={startRecording}>
            <MicRounded />
          </IconButton>
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
            <IconButton color="error" onClick={() => setVoiceUrl(null)}>
              <DeleteRounded />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <CategorySelect selectedCategories={selectedCategories} onCategoryChange={(categories) => setSelectedCategories(categories)} />

      <Button onClick={handleUpdateTask} variant="contained" color="primary">Update Task</Button>
    </Container>
  );
};

export default EditTask;
