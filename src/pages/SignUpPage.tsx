import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Link,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import styled from "styled-components";
import logo from "../assets/logo256.png"; // Ensure the logo path is correct

// Styled components for the logo section
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 50px;
  margin-right: 10px;
`;

const LogoText = styled.h2`
  font-weight: bold;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EfficioText = styled.span`
  color: #7764e8; /* Purple color */
`;

const AppText = styled.span`
  color: white; /* White color */
`;

const SignUpPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle profile picture selection and preview
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  // Handle user sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload profile picture to Firebase Storage (if provided)
      let profilePictureURL = "";
      if (profilePicture) {
        const fileRef = storageRef(storage, `profile-pictures/${user.uid}`);
        await uploadBytes(fileRef, profilePicture);
        profilePictureURL = await getDownloadURL(fileRef);
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        profilePicture: profilePictureURL,
        createdAt: new Date().toISOString(),
      });

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: profilePictureURL,
      });

      // Show success notification
      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing up:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        {/* Logo Section */}
        <LogoContainer onClick={() => navigate("/")}>
          <Logo src={logo} alt="logo" />
          <LogoText>
            <EfficioText>Efficio</EfficioText> <AppText>App</AppText>
          </LogoText>
        </LogoContainer>

        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Profile Picture Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            style={{ margin: "16px 0" }}
          />

          {/* Profile Picture Preview */}
          {profilePreview && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <img
                src={profilePreview}
                alt="Profile Preview"
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
              />
            </Box>
          )}

          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>

        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link href="/login">Login here</Link>.
        </Typography>
      </Box>

      {/* Success Notification */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Sign up successful! Redirecting to login page...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUpPage;
