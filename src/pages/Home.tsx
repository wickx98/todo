import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { GreetingHeader, GreetingText } from "../styles";

const Home = () => {
  const { user } = useContext(UserContext);
  const { emojisStyle, name } = user;
  const [taskCounts, setTaskCounts] = useState({ pending: 0, inProgress: 0, completed: 0, deleted: 0 });
  const [priorityCounts, setPriorityCounts] = useState({ urgentImportant: 0, urgentNotImportant: 0, notUrgentImportant: 0, notUrgentNotImportant: 0 });
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const db = getFirestore();
      const tasksRef = collection(db, `users/${currentUser.uid}/tasks`);

      const fetchTaskCounts = async () => {
        try {
          const querySnapshot = await getDocs(tasksRef);
          let pending = 0, inProgress = 0, completed = 0, deleted = 0;
          let urgentImportant = 0, urgentNotImportant = 0, notUrgentImportant = 0, notUrgentNotImportant = 0;

          querySnapshot.forEach((doc) => {
            const task = doc.data();
            if (task.status === "Pending") pending++;
            else if (task.status === "In Progress") inProgress++;
            else if (task.status === "Completed") completed++;
            else if (task.status === "Deleted") deleted++;

            if (task.priority === "Urgent & Important") urgentImportant++;
            else if (task.priority === "Urgent & Not Important") urgentNotImportant++;
            else if (task.priority === "Not Urgent & Important") notUrgentImportant++;
            else if (task.priority === "Not Urgent & Not Important") notUrgentNotImportant++;
          });

          setTaskCounts({ pending, inProgress, completed, deleted });
          setPriorityCounts({ urgentImportant, urgentNotImportant, notUrgentImportant, notUrgentNotImportant });
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchTaskCounts();
    }
  }, []);

  const statusData = [
    { name: "Pending", value: taskCounts.pending, color: "#ffcc80" },
    { name: "In Progress", value: taskCounts.inProgress, color: "#81d4fa" },
    { name: "Completed", value: taskCounts.completed, color: "#a5d6a7" },
    { name: "Deleted", value: taskCounts.deleted, color: "#e57373" },
  ];

  const priorityData = [
    { name: "Urgent & Important", value: priorityCounts.urgentImportant, color: "#ff7043" },
    { name: "Urgent & Not Important", value: priorityCounts.urgentNotImportant, color: "#ffca28" },
    { name: "Not Urgent & Important", value: priorityCounts.notUrgentImportant, color: "#66bb6a" },
    { name: "Not Urgent & Not Important", value: priorityCounts.notUrgentNotImportant, color: "#90a4ae" },
  ];

  return (
    <>
      <GreetingHeader>Welcome, {name}!</GreetingHeader>
      <GreetingText>**✨ Your Task Overview ✨**</GreetingText>

      <Typography variant="h4" gutterBottom>Task Overview</Typography>
      <Grid container spacing={2} justifyContent="center">
        {statusData.map((task) => (
          <Grid item xs={12} sm={6} md={3} key={task.name}>
            <Card style={{ backgroundColor: task.color }}>
              <CardContent>
                <Typography variant="h6">{task.name}</Typography>
                <Typography variant="h4">{task.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Priority Overview</Typography>
      <Grid container spacing={2} justifyContent="center">
        {priorityData.map((priority) => (
          <Grid item xs={12} sm={6} md={3} key={priority.name}>
            <Card style={{ backgroundColor: priority.color }}>
              <CardContent>
                <Typography variant="h6">{priority.name}</Typography>
                <Typography variant="h4">{priority.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" align="center">Task Status Breakdown</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" align="center">Task Priority Breakdown</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ff7043" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;