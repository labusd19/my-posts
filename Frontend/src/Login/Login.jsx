import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import api from "../api/base";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required!");
      return;
    }
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      const { token } = data;
      localStorage.setItem("userToken", token);
      console.log("Login successfuly");
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Login failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5">Login</Typography>
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Lozinka"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" align="center">
            You don't have an account?{" "}
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Signup here!
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
