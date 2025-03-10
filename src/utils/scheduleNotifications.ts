import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase"; // Adjust the import as per your Firebase setup

const habitCounts = {}; // Store counts for each habit separately

// Function to show a simple browser notification
export const sendNotification = (habitName) => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification("Habit Reminder", {
        body: `Time for: ${habitName} 🚀`,
      });

      // Show a pop-up message as well
      alert(`Time for your habit: ${habitName} 🚀`);
    }
  });
};

export const scheduleNotifications = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return; // Exit if no user is logged in

  const habitRef = collection(db, "users", userId, "habits");
  const snapshot = await getDocs(habitRef);
  const habits = snapshot.docs.map(doc => doc.data());

  // Loop through all habits to check startTime and duration
  habits.forEach(habit => {
    const { name, startTime, duration } = habit;
    const startDate = new Date(`1970-01-01T${startTime}:00Z`);
    const currentTime = new Date();

    // Convert startTime and current time to minutes since start of the day
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // Initialize count for this habit if not already set
    if (!(name in habitCounts)) {
      habitCounts[name] = 0;
    }

    console.log(`Current time: ${currentMinutes}, Start time: ${startMinutes}`);
    console.log(`Duration: ${duration}, Count: ${habitCounts[name]}`);

    // If current time is after or at the start time
    if (currentMinutes >= startMinutes) {
      habitCounts[name]++; // Increment count every minute

      // If count % duration === 0, trigger notification and reset count
      if (habitCounts[name] % duration === 0) {
        sendNotification(name);
        habitCounts[name] = 0; // Reset count after notification
      }
    }
  });
};