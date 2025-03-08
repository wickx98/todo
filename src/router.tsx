import { ReactElement, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Loading } from "./components";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component

const Home = lazy(() => import("./pages/Home"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const SharePage = lazy(() => import("./pages/Share"));
const AddTask = lazy(() => import("./pages/AddTask"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Transfer = lazy(() => import("./pages/Transfer"));
const Categories = lazy(() => import("./pages/Categories"));
const Purge = lazy(() => import("./pages/Purge"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignIn = lazy(() => import("./pages/SignUpPage"));
const LoginIn = lazy(() => import("./pages/LoginPage"));
const Calender = lazy(() => import("./pages/Calender"));  
const EditTask = lazy(() => import("./pages/EditTask"));
const HabitDetails = lazy(() => import("./pages/HabitDetails"));
const AddHabit = lazy(() => import("./pages/AddHabit"));  

const AppRouter = (): ReactElement => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignIn />} /> {/* Sign Up Route */}
        <Route path="/login" element={<LoginIn />} /> {/* Login Route */}

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/edit/:id" 
        element={
          <ProtectedRoute>
            <EditTask />
          </ProtectedRoute>
          
          } 
        />
        <Route
          path="/task"
          element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/share"
          element={
            <ProtectedRoute>
              <SharePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="task/add"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purge"
          element={
            <ProtectedRoute>
              <Purge />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calender"
          element={
            <ProtectedRoute>
              <Calender />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;