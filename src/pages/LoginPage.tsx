import React, { useState } from "react";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Link,
  Box,
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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error: any) {
      setError(error.message);
      console.error("Error logging in:", error);
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
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          Don't have an account? <Link href="/signup">Sign up here</Link>.
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
